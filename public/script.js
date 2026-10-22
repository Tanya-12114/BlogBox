// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', function() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add a little bounce animation
    this.style.transform = 'scale(0.9)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
});

// ===== Bundled backup articles (used only if the live feed is unreachable) =====
const BUNDLED_ARTICLES = {
    'writing-daily': {
        title: 'Why Writing Daily Transforms Your Thinking',
        category: 'Writing', author: 'Jane Doe', date: 'July 4, 2025', read: '5 min read',
        body: `
            <p>Most of us believe we think clearly until we try to write the thought down. On the page, the gaps show: a missing step, a word that means three things, an argument that only worked because it stayed in our head.</p>
            <h4>Writing is thinking made visible</h4>
            <p>A daily writing habit gives you a regular place to catch those gaps. You don't need a masterpiece. Ten minutes of honest sentences is enough to force vague ideas into a shape you can inspect and improve.</p>
            <blockquote>If you can't write it simply, you probably don't understand it yet.</blockquote>
            <h4>The compounding effect</h4>
            <p>After a few weeks, the benefits spill over. Emails get sharper, meetings get shorter because you can state a problem in two sentences, and decisions feel less foggy because you've already argued both sides on paper.</p>
            <h4>How to start</h4>
            <p>Pick a fixed time, set a small target (200 words is plenty), and lower the bar for quality. The goal is the streak, not the output. Quality follows volume.</p>`
    },
    'indie-tech-writers': {
        title: 'The Rise of Independent Tech Writers',
        category: 'Technology', author: 'Mark Liu', date: 'July 1, 2025', read: '4 min read',
        body: `
            <p>Newsletters, personal blogs, and paid communities have given tech writers something they rarely had before: a direct line to readers, with no editor between them and the audience.</p>
            <h4>Why it's working</h4>
            <p>Readers trust individuals more than brands. A developer who explains a tricky concept clearly, week after week, builds a loyalty that a generic media outlet struggles to match.</p>
            <h4>The business side</h4>
            <p>Subscriptions, sponsorships, and courses let small audiences support full-time work. You don't need a million readers, just a few thousand who find real value in what you publish.</p>
            <blockquote>A thousand true fans can beat a million casual visitors.</blockquote>
            <p>The trade-off is that independence means doing everything yourself: writing, editing, distribution, and accounting. The creators who thrive treat it as a business from day one.</p>`
    },
    'design-thinking': {
        title: 'Design Thinking for Developers',
        category: 'Design', author: 'Anika Patel', date: 'June 28, 2025', read: '5 min read',
        body: `
            <p>Developers are great at solving problems, but not always at choosing which problem to solve. Design thinking offers a simple framework for fixing that.</p>
            <h4>Five stages, one mindset</h4>
            <p>Empathize with users, define the real problem, ideate widely, prototype quickly, and test with real people. The stages loop; you rarely finish in a single pass.</p>
            <h4>Where developers can start</h4>
            <p>Sit in on a user interview. Sketch a screen on paper before opening your editor. Ship a rough prototype and watch someone try to use it without your help. Ten minutes of watching beats ten hours of assuming.</p>
            <blockquote>The best code is the code you didn't need to write because you understood the problem first.</blockquote>
            <p>You don't have to become a designer. You just need to get curious about the people on the other side of the screen.</p>`
    },
    'burnout-guide': {
        title: 'Burnout in Tech: A Survival Guide',
        category: 'Productivity', author: 'Sophia Kim', date: 'June 15, 2025', read: '6 min read',
        body: `
            <p>Burnout rarely arrives as a single bad week. It builds slowly: first the exhaustion, then the cynicism, then the sense that nothing you do matters.</p>
            <h4>Recognize the early signs</h4>
            <p>Dreading work you used to enjoy, trouble switching off in the evening, and irritability over small things are all common warnings. Catching them early makes recovery far easier.</p>
            <h4>Practical ways to recover</h4>
            <p>Protect your sleep, set clear boundaries on after-hours messages, and take real breaks, meaning actually away from the screen. Talk to your manager about workload before you hit a wall, not after.</p>
            <blockquote>Rest is not a reward for finishing the work. It is part of the work.</blockquote>
            <h4>Rebuild slowly</h4>
            <p>Recovery isn't linear. Reintroduce challenge gradually, and reconnect with the parts of your job that gave you energy in the first place.</p>`
    },
    'stay-creative': {
        title: 'How to Stay Creative as a Developer',
        category: 'Creativity', author: 'Alex Yu', date: 'June 10, 2025', read: '4 min read',
        body: `
            <p>Coding is a creative craft, but deadlines and tickets can make it feel mechanical. Creativity needs deliberate space.</p>
            <h4>Build things with no purpose</h4>
            <p>Make a toy project with no users and no roadmap. A generative art sketch, a tiny game, or a silly command-line tool all work. Play teaches you things work never will.</p>
            <h4>Feed your input</h4>
            <p>Read outside your field. Visit a museum, study architecture, learn an instrument. Fresh ideas come from unexpected connections.</p>
            <blockquote>Creativity is just connecting things that haven't been connected before.</blockquote>
            <h4>Make time to be bored</h4>
            <p>Walks without headphones are underrated. Some of the best solutions show up when you stop actively looking for them.</p>`
    },
    '100-days': {
        title: 'Lessons from 100 Days of Writing',
        category: 'Writing', author: 'Ravi Mehra', date: 'June 5, 2025', read: '5 min read',
        body: `
            <p>A hundred days ago I committed to publishing something every single day. Here is what I learned along the way.</p>
            <h4>Showing up beats inspiration</h4>
            <p>On most days I didn't feel like writing. I wrote anyway, and a surprising number of those reluctant sessions produced my favorite pieces.</p>
            <h4>Done is better than perfect</h4>
            <p>Daily deadlines cured my perfectionism. I learned to ship at "good enough," and the feedback taught me more than endless polishing ever did.</p>
            <blockquote>Consistency is a skill, and like any skill, it gets easier with reps.</blockquote>
            <h4>The joy crept in</h4>
            <p>Somewhere around day forty the habit stopped feeling like discipline and started feeling like a conversation with myself. That was the real reward.</p>`
    },
    'books-thinking': {
        title: 'Books That Shaped My Thinking',
        category: 'Writing', author: 'Natalie Fox', date: 'May 28, 2025', read: '6 min read',
        body: `
            <p>Some books change what you read next. These are the ones that reshaped how I write, code, and think.</p>
            <h4>On craft</h4>
            <p>Books on writing and software craftsmanship taught me that clarity is a discipline: short sentences, small functions, and one idea at a time.</p>
            <h4>On ideas</h4>
            <p>Works on systems thinking and the history of technology showed me how small decisions compound into large outcomes, in code as much as in culture.</p>
            <h4>On curiosity</h4>
            <p>Fiction, perhaps surprisingly, matters most. It trains empathy, which is the root of good design and good communication.</p>
            <blockquote>A reader lives a thousand lives before dying.</blockquote>
            <p>My advice: keep a running list, re-read the ones that stick, and don't be afraid to abandon a book that isn't working for you.</p>`
    },
    'design-systems-101': {
        title: 'Design Systems 101',
        category: 'Design', author: 'Anika Patel', date: 'May 20, 2025', read: '4 min read',
        body: `
            <p>A design system is a shared language: reusable components, clear rules, and documented decisions that keep a product consistent as it grows.</p>
            <h4>The building blocks</h4>
            <p>Start with design tokens (colors, spacing, type scale), then build components like buttons and inputs on top of them. Document when to use each one.</p>
            <h4>Start small</h4>
            <p>You don't need a full library on day one. Audit what you already have, standardize the most repeated patterns, and grow from there.</p>
            <blockquote>A system is only useful if people actually use it.</blockquote>`
    },
    'side-projects': {
        title: 'Building Side Projects',
        category: 'Productivity', author: 'Alex Yu', date: 'May 12, 2025', read: '4 min read',
        body: `
            <p>Side projects are where many developers learn the fastest, but most never get finished. A few habits help.</p>
            <h4>Scope ruthlessly</h4>
            <p>Define the smallest version that is still useful, and ship that first. You can always add features later; you can't recover abandoned momentum.</p>
            <h4>Set a deadline</h4>
            <p>A self-imposed date, even a loose one, turns a vague idea into a plan. Announce it publicly if you want extra accountability.</p>
            <blockquote>Ship it, then make it better.</blockquote>
            <p>Finally, celebrate finishing. A small, completed project teaches more than ten ambitious ones left in a folder.</p>`
    }
};

// ===== Live feed (served by server.js, which pulls from DEV Community) =====
// Set window.BLOGBOX_API = 'https://your-server.com' before this script if the
// server lives on a different address than the page.
const API = (window.BLOGBOX_API || '') + '/api';
const REFRESH_MS = 10 * 60 * 1000;      // auto-refresh every 10 minutes
const CACHE_KEY = 'blogbox_feed_v3';
const MAX_ARTICLES = 25;                // shown at once: 1 featured + 24 cards

// Each BlogBox category is fed by one or more DEV tags
const CATEGORIES = {
    writing:      { label: 'Writing',      tags: 'writing,blogging' },
    technology:   { label: 'Technology',   tags: 'technology,webdev,programming' },
    productivity: { label: 'Productivity', tags: 'productivity,career' },
    design:       { label: 'Design',       tags: 'design,ux,ui' },
    creativity:   { label: 'Creativity',   tags: 'creativity,art,inspiration' }
};

const store = new Map();   // id -> article
let feed = [];
let updatedAt = null;
let refreshing = false;
let lastFailed = false;
let lastError = '';

const featuredSlot = document.getElementById('featuredSlot');
const postList = document.getElementById('postList');
const recentList = document.getElementById('recentPosts');
const statusText = document.getElementById('feedStatusText');
const refreshBtn = document.getElementById('refreshBtn');
const noResults = document.getElementById('noResults');

// ---- Offline backup built from the bundled articles ----
function stripTags(html) {
    const d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent.replace(/\s+/g, ' ').trim();
}

const FALLBACK = Object.entries(BUNDLED_ARTICLES).map(([id, a]) => {
    const firstP = (a.body.match(/<p>([\s\S]*?)<\/p>/) || [, ''])[1];
    return {
        id, title: a.title, excerpt: stripTags(firstP),
        cats: [a.category.toLowerCase()], author: a.author,
        date: new Date(a.date).toISOString(), read: a.read,
        url: null, html: a.body
    };
});

// ---- Fetching ----
// Fetch the newest articles for ONE category
async function fetchCategory(key, limit) {
    const res = await fetch(`${API}/articles?category=${encodeURIComponent(key)}&limit=${limit}`);
    if (!res.ok) throw new Error('server answered HTTP ' + res.status);
    if (!(res.headers.get('content-type') || '').includes('json')) {
        throw new Error('the /api route returned a web page, so the server is not running');
    }
    const data = await res.json();
    return data.articles.map(a => ({ ...a, html: null }));
}

// Merge new articles into a list. An article can belong to several categories.
function mergeArticles(base, incoming) {
    const byId = new Map(base.map(a => [a.id, a]));
    incoming.forEach(a => {
        const existing = byId.get(a.id);
        if (existing) {
            a.cats.forEach(c => { if (!existing.cats.includes(c)) existing.cats.push(c); });
        } else {
            byId.set(a.id, a);
        }
    });
    return [...byId.values()].sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function fetchFeed() {
    return mergeArticles([], await fetchCategory('all', 100));
}

// Load extra articles for the category the visitor just selected
const loadedCategories = new Set();
let categoryLoading = false;

async function loadCategory(key, force = false) {
    if (key === 'all' || !CATEGORIES[key] || (!force && loadedCategories.has(key))) return;
    categoryLoading = true;
    updateEmptyMessage();
    try {
        const items = await fetchCategory(key, 30);
        feed = mergeArticles(feed, items);
        loadedCategories.add(key);
        if (activeCategory === key) render();
        saveCache();
    } catch (e) { /* keep what we already have */ }
    categoryLoading = false;
    updateEmptyMessage();
}

// ---- Cache (shows something instantly on the next visit) ----
function loadCache() {
    try {
        const c = JSON.parse(localStorage.getItem(CACHE_KEY));
        if (c && Array.isArray(c.articles) && c.articles.length) return c;
    } catch (e) { /* ignore */ }
    return null;
}
function saveCache() {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            updatedAt: updatedAt.toISOString(),
            articles: feed.map(a => ({ ...a, html: null }))
        }));
    } catch (e) { /* storage full or blocked – fine */ }
}

// ---- Rendering ----
function fmtDate(iso) {
    const d = new Date(iso);
    return isNaN(d) ? '' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
}

function metaEl(a) {
    const m = el('div', 'article-meta');
    const parts = ['By ' + a.author, fmtDate(a.date), a.read].filter(Boolean);
    parts.forEach((p, i) => {
        if (i) m.appendChild(el('span', '', '•'));
        m.appendChild(el('span', i === 0 ? 'author' : '', p));
    });
    return m;
}

function readBtn(label) {
    const b = el('button', 'read-more-btn', label + ' ');
    b.type = 'button';
    b.appendChild(el('i', 'bi bi-arrow-right'));
    return b;
}

function baseCard(a, cls) {
    const art = el('article', cls + ' post');
    art.dataset.category = a.cats.join(' ');
    art.dataset.id = a.id;
    art.tabIndex = 0;
    return art;
}

function featuredEl(a) {
    const art = baseCard(a, 'featured-article');
    art.append(
        el('span', 'featured-badge', 'Latest'),
        el('h2', 'article-title', a.title),
        metaEl(a),
        el('p', 'article-excerpt', a.excerpt),
        readBtn('Read Full Article')
    );
    return art;
}

function cardEl(a) {
    const art = baseCard(a, 'article-card');
    art.append(el('h3', '', a.title), metaEl(a), el('p', '', a.excerpt), readBtn('Read More'));
    return art;
}

function skeletons() {
    postList.replaceChildren(...Array.from({ length: 6 }, () => {
        const s = el('article', 'article-card skeleton');
        s.append(el('div', 'sk-line sk-title'), el('div', 'sk-line'), el('div', 'sk-line'), el('div', 'sk-line sk-short'));
        return s;
    }));
    featuredSlot.replaceChildren();
}

function render() {
    store.clear();
    feed.forEach(a => store.set(a.id, a));

    // Only the selected category (or everything) is shown; newest first
    const shown = feed.filter(a => activeCategory === 'all' || (a.cats || []).includes(activeCategory))
                      .slice(0, MAX_ARTICLES);
    const [first, ...rest] = shown;
    featuredSlot.replaceChildren(first ? featuredEl(first) : '');
    postList.replaceChildren(...rest.map(cardEl));

    // Sidebar "Recent Posts" = the 5 newest
    recentList.replaceChildren(...feed.slice(0, 5).map(a => {
        const li = document.createElement('li');
        const link = el('a', '', a.title);
        link.href = '#article/' + a.id;
        link.dataset.open = a.id;
        li.appendChild(link);
        return li;
    }));

    filterPosts();
}

function renderStatus() {
    refreshBtn.disabled = refreshing;
    refreshBtn.classList.toggle('spinning', refreshing);
    if (refreshing) {
        statusText.textContent = 'Fetching the latest articles…';
    } else if (lastFailed) {
        statusText.textContent = "Couldn't reach the live feed – showing " +
            (updatedAt ? 'articles saved from ' + updatedAt.toLocaleString() : 'sample articles') + '.' +
            (lastError ? ' (' + lastError + ')' : '');
    } else if (updatedAt) {
        statusText.textContent = 'Updated ' + updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
            ' · refreshes automatically every 10 minutes';
    }
}

async function refreshFeed() {
    if (refreshing) return;
    refreshing = true;
    renderStatus();
    try {
        feed = await fetchFeed();
        loadedCategories.clear();
        updatedAt = new Date();
        lastFailed = false;
        lastError = '';
        saveCache();
        render();
        loadCategory(activeCategory, true);   // top up the category being viewed
    } catch (err) {
        lastFailed = true;
        lastError = err && err.message ? err.message : 'unknown error';
        if (!feed.length) {
            feed = FALLBACK;
            render();
        }
    } finally {
        refreshing = false;
        renderStatus();
    }
}

// ===== Search and Filter =====
const searchInput = document.getElementById('searchInput');
const categoryPills = document.querySelectorAll('.category-pill');
let activeCategory = 'all';

function updateEmptyMessage() {
    const anyVisible = [...document.querySelectorAll('.post:not(.skeleton)')].some(p => p.style.display !== 'none');
    noResults.hidden = anyVisible || !feed.length;
    if (!noResults.hidden) {
        const label = activeCategory === 'all' ? '' : CATEGORIES[activeCategory].label + ' ';
        noResults.textContent = categoryLoading
            ? `Loading ${label}articles…`
            : (searchInput.value ? 'No articles match your search.' : `No ${label}articles found right now. Try Refresh.`);
    }
}

// Category is handled by render(); this only applies the search text
function filterPosts() {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll('.post').forEach(post => {
        if (post.classList.contains('skeleton')) return;
        post.style.display = post.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
    updateEmptyMessage();
}

searchInput.addEventListener('input', filterPosts);

categoryPills.forEach(pill => {
    pill.addEventListener('click', function () {
        categoryPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        activeCategory = this.dataset.category;
        render();                       // show what we already have right away
        loadCategory(activeCategory);   // then fetch more for this category
    });
});

// ===== Article Reader =====
function sanitize(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('script,style,iframe,object,embed,form,link,meta,base,svg,math,video,audio,source,input,button,textarea,select')
        .forEach(n => n.remove());

    doc.body.querySelectorAll('*').forEach(node => {
        [...node.attributes].forEach(attr => {
            const name = attr.name.toLowerCase();
            const val = attr.value.trim().toLowerCase();
            const unsafeUrl = (name === 'href' || name === 'src' || name === 'srcset') &&
                /^(javascript|vbscript|data):/.test(val) && !/^data:image\/(png|jpe?g|gif|webp);/.test(val);
            if (name.startsWith('on') || name === 'style' || name === 'srcdoc' || unsafeUrl) {
                node.removeAttribute(attr.name);
            }
        });
        if (node.tagName === 'A') { node.target = '_blank'; node.rel = 'noopener noreferrer'; }
        if (node.tagName === 'IMG') { node.loading = 'lazy'; }
    });
    return doc.body.innerHTML;
}

const readerOverlay = document.getElementById('readerOverlay');
const readerCloseBtn = document.getElementById('readerClose');
const readerContent = document.getElementById('readerContent');
let lastFocused = null;
let currentId = null;

function sourceLink(a) {
    if (!a.url) return '';
    const p = document.createElement('p');
    p.className = 'reader-source';
    const link = document.createElement('a');
    link.href = a.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Read the original on DEV Community →';
    p.appendChild(link);
    return p.outerHTML;
}

function showArticle(a, bodyHtml) {
    document.getElementById('readerCategory').textContent =
        (CATEGORIES[(a.cats || [])[0]] && CATEGORIES[a.cats[0]].label) || 'Article';
    document.getElementById('readerTitle').textContent = a.title;
    const meta = document.getElementById('readerMeta');
    meta.replaceChildren(...metaEl(a).childNodes);
    readerContent.innerHTML = bodyHtml;
}

async function openArticle(id, updateHash = true) {
    let a = store.get(id);

    // Deep link to an article that isn't in the current list
    if (!a && /^\d+$/.test(id)) {
        try {
            const res = await fetch(`${API}/articles/${id}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            a = { ...data, cats: data.cats || [] };
            a.html = sanitize(data.html || '');
            store.set(a.id, a);
        } catch (e) { return; }
    }
    if (!a) return;

    currentId = id;
    lastFocused = document.activeElement;
    readerOverlay.classList.add('open');
    readerOverlay.setAttribute('aria-hidden', 'false');
    readerOverlay.scrollTop = 0;
    document.body.classList.add('reader-open');
    readerCloseBtn.focus();
    if (updateHash) history.pushState(null, '', '#article/' + id);

    if (a.html) {
        showArticle(a, a.html + sourceLink(a));
        return;
    }

    // Remote article: show the summary right away, then load the full text
    showArticle(a, `<p>${a.excerpt.replace(/</g, '&lt;')}</p><p class="reader-loading">Loading full article…</p>`);
    try {
        const res = await fetch(`${API}/articles/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        a.html = sanitize(data.html || '');
        if (currentId === id && readerOverlay.classList.contains('open')) {
            showArticle(a, a.html + sourceLink(a));
        }
    } catch (e) {
        if (currentId === id && readerOverlay.classList.contains('open')) {
            showArticle(a, `<p>${a.excerpt.replace(/</g, '&lt;')}</p>
                <p class="reader-loading">Couldn't load the full text right now.</p>` + sourceLink(a));
        }
    }
}

function closeArticle(updateHash = true) {
    readerOverlay.classList.remove('open');
    readerOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('reader-open');
    currentId = null;
    if (updateHash && location.hash.startsWith('#article/')) {
        history.pushState(null, '', location.pathname + location.search);
    }
    if (lastFocused && lastFocused.isConnected) lastFocused.focus();
}

// One delegated handler works for cards that are created later by the feed
document.addEventListener('click', e => {
    const link = e.target.closest('[data-open]');
    if (link) {
        e.preventDefault();
        openArticle(link.dataset.open);
        return;
    }
    const post = e.target.closest('.post[data-id]');
    if (post) openArticle(post.dataset.id);
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && readerOverlay.classList.contains('open')) {
        closeArticle();
    } else if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('post') && e.target.dataset.id) {
        openArticle(e.target.dataset.id);
    }
});

readerCloseBtn.addEventListener('click', () => closeArticle());
readerOverlay.addEventListener('click', e => {
    if (e.target === readerOverlay) closeArticle();
});

// Deep links and browser back/forward button
function syncWithHash() {
    const match = location.hash.match(/^#article\/(.+)$/);
    if (match) {
        openArticle(match[1], false);
    } else if (readerOverlay.classList.contains('open')) {
        closeArticle(false);
    }
}
window.addEventListener('popstate', syncWithHash);
window.addEventListener('hashchange', syncWithHash);

// ===== Start-up and auto-refresh =====
refreshBtn.addEventListener('click', refreshFeed);

const cached = loadCache();
if (cached) {
    feed = cached.articles.map(a => ({ ...a, cats: a.cats || [] }));
    updatedAt = new Date(cached.updatedAt);
    render();           // instant content from the last visit
} else {
    skeletons();
}
renderStatus();
syncWithHash();
refreshFeed();          // always pull fresh articles on every page load

setInterval(refreshFeed, REFRESH_MS);
document.addEventListener('visibilitychange', () => {
    // Coming back to the tab after a while? Refresh.
    if (!document.hidden && (!updatedAt || Date.now() - updatedAt.getTime() > REFRESH_MS)) refreshFeed();
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Smooth appearance on scroll
document.querySelectorAll('.sidebar-card').forEach(el => {
    observer.observe(el);
});