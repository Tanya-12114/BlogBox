# BlogBox – A Blog That Always Shows the Latest Articles

A responsive blog with search, category filters, dark/light theme and an in-page article reader.
A small Node.js server pulls the newest articles from [DEV Community](https://dev.to) (free, no API key),
cleans them, caches them, and serves them to the page.

## Run it

You need [Node.js 18+](https://nodejs.org).

```bash
npm install
npm start
```

Then open **http://localhost:3000**

## How it works

```
Browser  -->  server.js (Express)  -->  DEV Community API
              - caches lists for 10 min
              - caches full articles for 1 hour
              - strips unsafe HTML
              - serves last good data if the source is down
```

- The page refreshes itself every 10 minutes, whenever you return to the tab, and via the **Refresh** button.
- Clicking a category loads that category's own newest articles.
- If the server can't be reached, the page shows the last saved articles (or a few built-in samples).

## Project layout

| File | Purpose |
| --- | --- |
| `server.js` | Web server + article API + cache |
| `public/index.html` | Page structure |
| `public/styles.css` | Styling (dark/light themes) |
| `public/script.js` | Feed loading, search, filters, article reader |

## API

- `GET /api/articles?category=all|writing|technology|productivity|design|creativity&limit=30`
- `GET /api/articles/:id` - full article text
- `GET /api/health` - quick status check (what is cached and how old it is)

## Customising

- **Topics:** edit the `CATEGORIES` list at the top of `server.js` (each category is a set of DEV tags). The server asks for each tag separately and only keeps articles that really carry one of the category's tags.
- **Freshness:** `RECENT_DAYS` in `server.js` (default 7) prefers articles from the last week; quiet topics are topped up with older popular ones.
- **Refresh speed:** change `LIST_TTL` in `server.js` and `REFRESH_MS` in `public/script.js`.
- **Port:** `PORT=8080 npm start`

## Deploying

Because it now has a server, GitHub Pages alone can't host it. Free options that work with
`npm install` + `npm start`: Render, Railway, Fly.io, or any VPS.
