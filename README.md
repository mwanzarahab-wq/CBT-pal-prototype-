# CBT Pal — PWA build

Static site, no build step. Files:

- `index.html` — app shell
- `app.js` — all UI + logic (vanilla JS, no framework)
- `manifest.json` — PWA manifest (installable, standalone display)
- `sw.js` — service worker (offline app-shell caching)
- `icons/` — app icons (192, 512, maskable, apple-touch, favicon)
- `netlify.toml` — cache headers for Netlify

## Deploy to Netlify

**Option A — drag and drop**
Go to https://app.netlify.com/drop and drag this whole folder in. Done.

**Option B — connect to GitHub**
1. Push this folder to a GitHub repo.
2. In Netlify: *Add new site → Import an existing project → GitHub* → pick the repo.
3. Build command: leave blank. Publish directory: `.` (repo root, since these files sit at the top level — adjust if you nest them in a subfolder).
4. Deploy.

## About the Navigator chat

The Navigator's live AI replies currently run through `window.claude.use("sample")`,
which is only available when this page is opened as a Claude artifact preview inside
claude.ai — it does **not** exist on Netlify. On this deployment the chat will fall
back to a static message and the crisis-detection + Support-tab flows still work fully,
but there's no live AI reply.

To get real replies on Netlify, you'd add your own backend (a Netlify Function or an
external API) that calls the Anthropic API server-side, and point `state.sample` in
`app.js` at that endpoint instead. Happy to help wire that up when you're ready.
