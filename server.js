// BlogBox server
// - serves the website from /public
// - fetches the latest articles from DEV Community, cleans them, caches them
// - exposes a small JSON API the page uses:
//     GET /api/articles?category=all|writing|technology|productivity|design|creativity&limit=30
//     GET /api/articles/:id
//     GET /api/health

const express = require('express');
const sanitizeHtml = require('sanitize-html');
const path = require('path');

const PORT = process.env.PORT || 3000;
const UPSTREAM = process.env.UPSTREAM || 'https://dev.to/api';  // overridable (used by tests)
const LIST_TTL = 10 * 60 * 1000;      // article lists are re-fetched after 10 minutes
const BODY_TTL = 60 * 60 * 1000;      // full article text is cached for 1 hour
const TIMEOUT = 8000;

// Each BlogBox category is fed by a few related DEV tags
const CATEGORIES = {
    writing:      { label: 'Writing',      tags: ['writing', 'blogging'] },
    technology:   { label: 'Technology',   tags: ['technology', 'webdev', 'programming'] },
    productivity: { label: 'Productivity', tags: ['productivity', 'career'] },
    design:       { label: 'Design',       tags: ['design', 'ux', 'ui'] },
    creativity:   { label: 'Creativity',   tags: ['creativity', 'art', 'inspiration'] }
};

// ---------- helpers ----------
async function getJson(url) {
    const res = await fetch(url, {
        headers: { 'User-Agent': 'BlogBox/2.0', 'Accept': 'application/json' },
        signal: AbortSignal.timeout(TIMEOUT)
    });
    if (!res.ok) throw new Error(`Upstream ${res.status} for ${url}`);
    return res.json();
}

function normalize(a, category) {
    return {
        id: String(a.id),
        title: a.title,
        excerpt: a.description || '',
        cats: category ? [category] : [],
        author: (a.user && a.user.name) || 'Unknown author',
        date: a.published_at || a.created_at || new Date().toISOString(),
        read: a.reading_time_minutes ? `${a.reading_time_minutes} min read` : '',
        url: a.url || a.canonical_url || null
    };
}

function clean(html) {
    return sanitizeHtml(html || '', {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(
            ['img', 'h1', 'h2', 'figure', 'figcaption', 'details', 'summary', 'span']),
        allowedAttributes: {
            a: ['href', 'name', 'target', 'rel'],
            img: ['src', 'alt', 'title', 'width', 'height', 'loading']
        },
        allowedSchemes: ['http', 'https', 'mailto'],
        transformTags: {
            a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
            img: sanitizeHtml.simpleTransform('img', { loading: 'lazy' })
        }
    });
}

// Merge lists; an article can belong to several categories. Newest first.
function merge(lists) {
    const byId = new Map();
    for (const a of lists.flat()) {
        const have = byId.get(a.id);
        if (have) a.cats.forEach(c => { if (!have.cats.includes(c)) have.cats.push(c); });
        else byId.set(a.id, { ...a, cats: [...a.cats] });
    }
    return [...byId.values()].sort((x, y) => new Date(y.date) - new Date(x.date));
}

// ---------- article lists (with cache) ----------
const listCache = new Map();   // key -> { at, articles }
const inflight = new Map();    // key -> Promise, so simultaneous visitors share one request

async function fetchCategory(key, perPage) {
    const cat = CATEGORIES[key];
    const q = n => `${UPSTREAM}/articles?per_page=${perPage}&${n}`;
    let list = await getJson(q('tags=' + encodeURIComponent(cat.tags.join(','))));
    // Safety net: if the combined query is empty, try each tag on its own
    for (let i = 0; !list.length && i < cat.tags.length; i++) {
        list = await getJson(q('tag=' + encodeURIComponent(cat.tags[i])));
    }
    return list.map(a => normalize(a, key));
}

// "all" = the five category lists merged (each is cached on its own)
async function loadAll() {
    const results = await Promise.allSettled(Object.keys(CATEGORIES).map(k => getList(k)));
    const ok = results.filter(r => r.status === 'fulfilled').map(r => r.value.articles);
    if (!ok.length) throw new Error('All upstream requests failed');
    return merge(ok);
}

// Returns { articles, updatedAt, stale }. Falls back to old data if the source is down.
async function getList(category) {
    const key = category;
    const hit = listCache.get(key);
    if (hit && Date.now() - hit.at < LIST_TTL) return { articles: hit.articles, updatedAt: hit.at, stale: false };

    if (!inflight.has(key)) {
        inflight.set(key, (async () => {
            try {
                const articles = category === 'all' ? await loadAll() : await fetchCategory(category, 30);
                listCache.set(key, { at: Date.now(), articles });
                return { articles, updatedAt: Date.now(), stale: false };
            } catch (err) {
                if (hit) {
                    console.warn(`[stale] ${key}: ${err.message}`);
                    return { articles: hit.articles, updatedAt: hit.at, stale: true };
                }
                throw err;
            } finally {
                inflight.delete(key);
            }
        })());
    }
    return inflight.get(key);
}

// ---------- full article text (with cache) ----------
const bodyCache = new Map();   // id -> { at, article }

async function getArticle(id) {
    const hit = bodyCache.get(id);
    if (hit && Date.now() - hit.at < BODY_TTL) return hit.article;

    const data = await getJson(`${UPSTREAM}/articles/${id}`);
    const article = { ...normalize(data, null), html: clean(data.body_html) };
    // Work out categories from the article's own tags
    const tags = data.tag_list || (data.tags ? String(data.tags).split(/,\s*/) : []);
    article.cats = Object.keys(CATEGORIES).filter(k => CATEGORIES[k].tags.some(t => tags.includes(t)));
    bodyCache.set(id, { at: Date.now(), article });
    return article;
}

// ---------- web server ----------
const app = express();

app.get('/api/articles', async (req, res) => {
    const category = String(req.query.category || 'all').toLowerCase();
    if (category !== 'all' && !CATEGORIES[category]) {
        return res.status(400).json({ error: 'Unknown category' });
    }
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 30, 1), 100);

    try {
        const { articles, updatedAt, stale } = await getList(category);
        res.set('Cache-Control', 'no-cache');
        res.json({ category, stale, updatedAt: new Date(updatedAt).toISOString(), articles: articles.slice(0, limit) });
    } catch (err) {
        console.error('[error] list', category, err.message);
        res.status(502).json({ error: 'Could not reach the article source right now.' });
    }
});

app.get('/api/articles/:id', async (req, res) => {
    if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'Bad id' });
    try {
        res.set('Cache-Control', 'no-cache');
        res.json(await getArticle(req.params.id));
    } catch (err) {
        console.error('[error] article', req.params.id, err.message);
        res.status(502).json({ error: 'Could not load this article right now.' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        upstream: UPSTREAM,
        cachedLists: [...listCache].map(([k, v]) => ({ category: k, articles: v.articles.length, ageSeconds: Math.round((Date.now() - v.at) / 1000) }))
    });
});

app.use(express.static(path.join(__dirname, 'public')));

if (require.main === module) {
    app.listen(PORT, () => console.log(`BlogBox running at http://localhost:${PORT}`));
}
module.exports = app;
