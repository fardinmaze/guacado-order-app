# Guacado Mexican Grill — Website

Sales-first site for Guacado Mexican Grill (Chipotle-style ordering layout), built with **Vue 3 + Vite** (JavaScript). The earlier brand-focused dark build is kept under the git tag `brand-version`. Brand assets and menu data: [`BRAND.md`](BRAND.md).

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # vitest (31 tests)
npm run build     # outputs dist/
npm run preview   # serve the build
```

Requires Node 20+ (developed on Node 24).

## Deploying

`dist/` is static. Because routes use history mode, configure the host to serve `index.html` for unknown paths (Netlify `/* /index.html 200`, Vercel rewrites, nginx `try_files $uri /index.html`).

## Docs

| File | Contents |
|---|---|
| [`docs/PROGRESS_LOG.md`](docs/PROGRESS_LOG.md) | What is done, decisions, open items. **Update every session.** |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Folder map, layering rules, data flow, motion, routing |
| [`docs/EDITING_CONTENT.md`](docs/EDITING_CONTENT.md) | How to change menu, prices, locations, nav, copy |
| [`BRAND.md`](BRAND.md) | Design tokens, type, components, motion spec, a11y checklist |

## Other files in this folder

- `reference/guacado-landing.html` — original single-file build; compare against it.
- `Guacado Mexican Grill.md` — text scrape of the live site.
- `guacado-brand-kit.zip` — original kit from the owner (already unpacked into `src/`).
