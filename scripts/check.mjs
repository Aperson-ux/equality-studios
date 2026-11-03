import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { newsArticles } from '../dist/assets/news-data.js';

const root = path.resolve(import.meta.dirname, '..');
const app = readFileSync(path.join(root, 'dist/assets/app.js'), 'utf8');
const css = readFileSync(path.join(root, 'dist/assets/improvements.css'), 'utf8');
const routes = ['/', '/about', '/games', '/games/the-huss-rooms', '/studio', '/videos', '/updates', '/news', ...newsArticles.map(a => `/news/${a.slug}`)];

for (const route of routes) {
  const html = readFileSync(path.join(root, 'dist', route, 'index.html'), 'utf8');
  assert(html.includes('name="description"'), `Missing description: ${route}`);
  assert(html.includes(`rel="canonical" href="https://equality-studios-8stvy.cosmejayden2.chatgpt.site${route}"`), `Wrong canonical: ${route}`);
  for (const match of html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)) {
    assert(existsSync(path.join(root, 'dist', match[1])), `Missing local HTML asset: ${match[1]}`);
  }
}
for (const image of ['avatar.webp','studio.webp','studio.png','game.webp','game.png','verity.webp','map.webp','game2.webp','short1.jpg','short2.jpg','short3.jpg']) {
  const bytes = readFileSync(path.join(root,'dist/images', image));
  assert(bytes.length > 100, `Invalid image: ${image}`);
  assert(!bytes.subarray(0,100).toString().includes('<html'), `Image is an HTML error: ${image}`);
}
assert.equal(new Set(newsArticles.map(a => a.slug)).size, newsArticles.length, 'Duplicate article URLs');
for (const article of newsArticles) {
  assert(existsSync(path.join(root, 'dist', article.image)), `Missing article image: ${article.slug}`);
  assert(routes.includes(article.related.href), `Broken article destination: ${article.related.href}`);
  assert(new URL(article.source.url).protocol === 'https:');
  assert(Number.isFinite(Date.parse(article.date)), `Invalid article date: ${article.slug}`);
}
assert(app.includes('case`/news`:'), 'Missing news route');
assert(app.includes('equalityNews.Article'), 'Missing article routing');
assert(app.includes('communities/671879338/Equality-Studios'), 'Missing canonical group destination');
assert(!app.includes('data-runable-badge'), 'Builder branding still mounted');
assert(app.includes('aria-current') && app.includes('Main navigation'), 'Missing accessible navigation');
assert(app.includes('Equality Studios home') && !app.includes('Open menu'), 'Navigation must stay visible');
assert(css.includes('focus-visible') && css.includes('@media(max-width:600px)'), 'Missing keyboard or mobile styling');
console.log(`PASS: ${routes.length} routes, 11 images, ${newsArticles.length} source-backed articles, metadata, navigation, and article destinations.`);
