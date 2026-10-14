// Shared data loader. Every page reads data/site.json + data/events.json through this file.
const url = p => new URL(p, document.baseURI).href;
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let cache;

export function fmtDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DAYS[dt.getUTCDay()]} ${d} ${MON[m - 1]} ${y}`;
}

export const wa = (num, text) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`;

export const param = k => new URLSearchParams(location.search).get(k);

export function load() {
  if (!cache) {
    cache = Promise.all([
      fetch(url('data/site.json')).then(r => r.json()),
      fetch(url('data/events.json')).then(r => r.json())
    ]).then(([site, ev]) => prepare(site, ev));
  }
  return cache;
}

function prepare(site, evData) {
  const c = site.contact;
  const brands = site.brands.map(b => ({
    ...b,
    href: `Brand.dc.html?b=${b.id}`,
    boothEnquiryUrl: wa(c.whatsapp, `Hi, I'd like to enquire about a booth at ${b.name}.`)
  }));
  const byId = Object.fromEntries(brands.map(b => [b.id, b]));
  const events = evData.events.map(e => {
    const b = byId[e.brand] || {};
    const dateLabel = fmtDate(e.date);
    return {
      ...e,
      dateLabel,
      brandName: b.name || '',
      brandHref: b.href || 'Home.dc.html',
      accent: b.accent || '#1c1d1f',
      accentText: b.accentText || '#1c1d1f',
      href: e.infoUrl || `Event.dc.html?id=${e.id}`,
      artworkLabel: `EVENT ARTWORK · 4:5 (e.g. 1080×1350) · ${e.artwork}`,
      lineup: e.lineup || [],
      prices: e.prices || [],
      boothEnquiryUrl: wa(c.whatsapp, `Hi, I'd like to enquire about a booth for ${e.name} on ${dateLabel}.`)
    };
  }).sort((a, b) => a.date.localeCompare(b.date));
  const today = new Date().toISOString().slice(0, 10);
  brands.forEach(b => {
    const list = events.filter(e => e.brand === b.id);
    b.event = list.find(e => e.date >= today) || null;
  });
  const tours = (site.tours || []).map(t => ({
    ...t,
    artworkLabel: `TOUR ARTWORK · 4:5 · ${t.artwork}`,
    dates: t.dates.map(d => ({ ...d, dateLabel: fmtDate(d.date) }))
  }));
  return { site, contact: c, brands, events, tours, month: evData.month, whatsOn: brands.filter(b => b.event).map(b => b.event).sort((a, b) => a.date.localeCompare(b.date)) };
}
