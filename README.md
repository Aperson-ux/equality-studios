# Equality Studios

A faithful recreation of the user-supplied Runable website, with Equality News and targeted navigation, accessibility, metadata, and link improvements.

## Editing

- `dist/assets/news-data.js`: add or edit source-backed news articles. Dates on background notes are dates checked, not invented announcements.
- `dist/assets/news.js`: news search, filters, sorting, article pages, related stories, and sharing.
- `dist/assets/improvements.css`: new styling and focused repairs; original styling remains in `site.css`.
- `source/original-app.js`: supplied site's original compiled React application, retained for fidelity.
- `source/header.js`: sticky brand header and visible links on every screen size.
- `scripts/prepare.mjs`: reproducibly patches the retained application and generates route-specific HTML.

Run `npm run build`, then `npm run check`. No dependency installation is needed.

The public Roblox profile, group ownership, game publisher, update notes, and Discord invitation were checked on November 3, 2026. The invitation was valid when checked, but expires December 3, 2026; replace it with an owner-provided permanent invitation when available. This repository does not provide an admin CMS or automatic news ingestion.

The recreated site deploys separately from the original Runable URL.
