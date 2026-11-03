import { newsArticles } from './news-data.js';

export function createNewsComponents({ React, Link, External, Intro, Eyebrow, Community }) {
  const h = React.createElement;
  const categories = ['All news', 'Game updates', 'Studio', 'Creator'];
  const dateText = value => new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
  }).format(new Date(`${value}T12:00:00Z`));
  const storyHref = article => `/news/${article.slug}`;
  const arrow = h('span', { 'aria-hidden': true }, '↗');

  function Category({ children }) {
    return h('span', { className: 'tags' }, h('span', null, children));
  }

  function Card({ article }) {
    return h('article', { className: `news-card news-card-${article.category.toLowerCase().replaceAll(' ', '-')}` },
      h(Link, { href: storyHref(article), className: 'news-card-image', tabIndex: -1, 'aria-hidden': true },
        h('img', { src: article.image, alt: '', loading: 'lazy', width: 640, height: 360 })),
      h('div', { className: 'news-card-copy' },
        h('div', { className: 'news-card-meta' }, h(Category, null, article.category),
          h('time', { dateTime: article.date }, dateText(article.date))),
        h('h2', null, h(Link, { href: storyHref(article) }, article.title)),
        h('p', null, article.summary),
        h(Link, { href: storyHref(article), className: 'text-link', 'aria-label': `Read: ${article.title}` }, 'Read story ', arrow)));
  }

  function Preview({ compact = false }) {
    return h('section', { className: 'section equality-news-preview' },
      h('div', { className: 'section-head' },
        h('div', null, h(Eyebrow, null, 'THE EQUALITY EDIT'), h('h2', null, 'Equality News.')),
        h(Link, { href: '/news', className: 'text-link' }, 'All news ', arrow)),
      compact
        ? h(Link, { href: '/news', className: 'news-studio-link' },
          h('div', null, h('h3', null, 'Keep up with Equality.'),
            h('p', null, 'Game updates, studio notes, and creator connections.')), arrow)
        : h('div', { className: 'news-grid' }, newsArticles.map(article => h(Card, { article, key: article.slug }))));
  }

  function Hub() {
    const [category, setCategory] = React.useState('All news');
    const [query, setQuery] = React.useState('');
    const [sort, setSort] = React.useState('newest');
    const featured = newsArticles.find(article => article.featured);
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = newsArticles.filter(article =>
      (category === 'All news' || article.category === category) &&
      `${article.title} ${article.summary} ${article.category} ${article.paragraphs.join(' ')}`.toLowerCase().includes(normalizedQuery)
    ).sort((a, b) => sort === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));

    return h(React.Fragment, null,
      h(Intro, { label: 'THE EQUALITY EDIT', title: 'Equality News.',
        text: 'Game updates, studio notes, and the creator behind it all. Your checkpoint for Equality Studios.' }),
      h('section', { className: 'news-feature', 'aria-label': 'Featured story' },
        h(Link, { href: storyHref(featured), className: 'news-feature-image', tabIndex: -1, 'aria-hidden': true },
          h('img', { src: featured.image, alt: '', width: 960, height: 540 })),
        h('div', { className: 'news-feature-copy' },
          h('div', { className: 'news-feature-label' }, h('span', null, 'FEATURED'), h(Category, null, featured.category)),
          h('h2', null, h(Link, { href: storyHref(featured) }, featured.title)),
          h('p', null, featured.summary),
          h('span', { className: 'news-feature-date' }, featured.dateLabel),
          h(Link, { href: storyHref(featured), className: 'button primary' }, 'Read the story ', arrow))),
      h('section', { className: 'section news-feed', 'aria-labelledby': 'news-feed-title' },
        h('div', { className: 'section-head' }, h('h2', { id: 'news-feed-title' }, 'The studio journal.'),
          h('p', { className: 'news-feed-note' }, 'Original sources. Clear context.')),
        h('div', { className: 'news-toolbar' },
          h('fieldset', { className: 'filters news-filters' },
            h('legend', { className: 'visually-hidden' }, 'Filter news by category'),
            categories.map(name => h('button', {
              key: name, type: 'button', className: category === name ? 'selected' : '',
              'aria-pressed': category === name, onClick: () => setCategory(name)
            }, name))),
          h('div', { className: 'news-tools' },
            h('label', { className: 'news-search' },
              h('span', { className: 'visually-hidden' }, 'Search Equality News'),
              h('span', { 'aria-hidden': true }, '⌕'),
              h('input', { type: 'search', value: query, placeholder: 'Search news…', maxLength: 160,
                onChange: event => setQuery(event.target.value) })),
            h('label', { className: 'news-sort-label' },
              h('span', { className: 'visually-hidden' }, 'Sort news'),
              h('select', { value: sort, onChange: event => setSort(event.target.value) },
                h('option', { value: 'newest' }, 'Newest first'), h('option', { value: 'oldest' }, 'Oldest first'))))),
        h('p', { className: 'news-results', role: 'status', 'aria-live': 'polite' },
          `${filtered.length} ${filtered.length === 1 ? 'story' : 'stories'}${category !== 'All news' ? ` in ${category}` : ''}${normalizedQuery ? ` matching “${query.trim()}”` : ''}`),
        filtered.length
          ? h('div', { className: 'news-grid' }, filtered.map(article => h(Card, { article, key: article.slug })))
          : h('div', { className: 'news-empty' }, h('h3', null, 'No stories found.'),
              h('p', null, 'Try a different search or explore all of Equality News.'),
              h('button', { type: 'button', className: 'button secondary', onClick: () => {
                setCategory('All news'); setQuery(''); setSort('newest');
              } }, 'Clear filters')),
        h('p', { className: 'source-note news-editorial-note' },
          'Game update dates come from Roblox. Studio and creator notes are background articles dated when checked. This journal is curated; visit the original communities for new announcements.')),
      h(Community));
  }

  function Article({ slug }) {
    const article = newsArticles.find(item => item.slug === slug);
    const [copied, setCopied] = React.useState(false);
    const [copyFailed, setCopyFailed] = React.useState(false);
    const timer = React.useRef(null);
    const fallbackInput = React.useRef(null);
    React.useEffect(() => { setCopied(false); setCopyFailed(false); return () => clearTimeout(timer.current); }, [slug]);
    React.useEffect(() => { if (copyFailed) { fallbackInput.current?.focus(); fallbackInput.current?.select(); } }, [copyFailed]);
    if (!article) return h(React.Fragment, null,
      h(Intro, { label: 'EQUALITY NEWS', title: 'Story not found.', text: 'This article may have moved. Explore the journal to find the latest stories.' }),
      h(Link, { href: '/news', className: 'button primary' }, 'Back to Equality News'));
    async function copyLink() {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopyFailed(false); setCopied(true); clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 2500);
      } catch { setCopyFailed(true); }
    }
    return h(React.Fragment, null,
      h(Link, { href: '/news', className: 'breadcrumb' }, '← Equality News'),
      h('article', { className: `news-story news-story-${article.category.toLowerCase().replaceAll(' ', '-')}` },
        h('header', { className: 'news-story-header' }, h(Category, null, article.category),
          h('h1', null, article.title), h('p', { className: 'news-story-summary' }, article.summary),
          h('div', { className: 'news-story-byline' }, h('span', null, 'Equality News'),
            h('time', { dateTime: article.date }, article.dateLabel), h('span', null, article.readTime))),
        h('img', { className: 'news-story-image', src: article.image, alt: article.imageAlt, width: 1200, height: 675 }),
        h('div', { className: 'news-story-body' },
          article.paragraphs.map((paragraph, i) => h('p', { key: i }, paragraph)),
          article.highlights && h('section', { className: 'news-highlights' },
            h('h2', null, 'What the update notes list'),
            h('ul', null, article.highlights.map(item => h('li', { key: item }, item)))),
          h('div', { className: 'news-source' }, h('span', null, `Source checked ${article.checked}`),
            h(External, { href: article.source.url, className: 'text-link' }, article.source.label, ' ', arrow)),
          h('div', { className: 'button-row news-story-actions' },
            h(Link, { href: article.related.href, className: 'button primary' }, article.related.label, ' ', arrow),
            h('button', { type: 'button', className: 'button secondary', onClick: copyLink }, copied ? 'Link copied ✓' : 'Copy story link'),
            h('span', { className: 'visually-hidden', role: 'status' }, copied ? 'Story link copied to clipboard.' : '')),
          copyFailed && h('label', { className: 'news-copy-fallback' }, 'Copy this story link:',
            h('input', { ref: fallbackInput, readOnly: true, value: window.location.href })))),
      h('section', { className: 'section' },
        h('div', { className: 'section-head' }, h('h2', null, 'Keep exploring.')),
        h('div', { className: 'news-grid news-related' }, newsArticles.filter(item => item.slug !== slug).map(item => h(Card, { article: item, key: item.slug })))));
  }
  return { Hub, Article, Preview, articles: newsArticles };
}
