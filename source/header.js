// Shared, always-visible navigation. The creator identity stays in page content.
function lt() {
  let [currentPath] = Se();
  currentPath = normalizePath(currentPath);
  const h = _.createElement;

  _.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = pageTitle(currentPath);
    updateMetadata(currentPath);
    document.querySelector('main')?.focus({ preventScroll: true });
  }, [currentPath]);

  return h('header', { className: 'header equality-header' },
    h('div', { className: 'header-top' },
      h(we, { href: '/', className: 'brand', 'aria-label': 'Equality Studios home' },
        h('span', { className: 'brand-mark', 'aria-hidden': true }, '='),
        h('span', null, 'Equality Studios')),
      h(k, { href: O.discord, className: 'header-join', label: 'Join the Equality Studios Discord community' },
        h(it), h('span', null, 'Join the community'), h(E, { size: 15 }))),
    h('nav', { className: 'nav', id: 'main-navigation', 'aria-label': 'Main navigation' },
      ot.map(([label, href]) => h(we, {
        key: href, href,
        className: isActive(currentPath, href) ? 'active' : '',
        'aria-current': isActive(currentPath, href) ? 'page' : undefined
      }, label))));
}
