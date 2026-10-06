// Builds the chapter sidebar on every docs page.
// To add a chapter: create the HTML file from _predlozak.html and add one line to CHAPTERS below.
const CHAPTERS = [
  { group: 'Uvod', items: [
    { file: 'index.html', title: 'O ovoj dokumentaciji' },
    { file: 'pregled-sustava.html', title: 'Pregled sustava' },
    { file: 'lokalno-okruzenje.html', title: 'Lokalno okruženje i testiranje' },
  ] },
  { group: 'Rad na projektu', items: [
    { file: 'odluke.html', title: 'Odluke' },
    { file: 'sigurnosni-popravci.html', title: 'Sigurnosni popravci' },
    { file: 'dnevnik-promjena.html', title: 'Dnevnik promjena' },
    { file: 'otvorena-pitanja.html', title: 'Otvorena pitanja' },
  ] },
];

(function buildSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const current = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
  const headings = [...document.querySelectorAll('main h2[id]')];

  const toggle = document.createElement('button');
  toggle.className = 'menu-toggle';
  toggle.type = 'button';
  toggle.textContent = 'Poglavlja';
  toggle.setAttribute('aria-expanded', 'false');

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Poglavlja');

  for (const group of CHAPTERS) {
    const title = document.createElement('h2');
    title.textContent = group.group;
    const list = document.createElement('ol');

    for (const item of group.items) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.className = 'chapter';
      link.href = item.file;
      link.textContent = item.title;
      li.append(link);

      if (item.file === current) {
        link.setAttribute('aria-current', 'page');
        if (headings.length) {
          const toc = document.createElement('div');
          toc.className = 'toc';
          for (const h of headings) {
            const a = document.createElement('a');
            a.href = `#${h.id}`;
            a.textContent = h.textContent;
            toc.append(a);
          }
          li.append(toc);
        }
      }
      list.append(li);
    }
    nav.append(title, list);
  }

  const narrow = window.matchMedia('(max-width: 900px)');
  const sync = () => { nav.hidden = narrow.matches && toggle.getAttribute('aria-expanded') !== 'true'; };
  toggle.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
    sync();
  });
  narrow.addEventListener('change', sync);

  sidebar.append(toggle, nav);
  sync();
})();
