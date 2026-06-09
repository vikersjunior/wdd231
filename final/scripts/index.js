// index.js — Home page main module
import { initNav }                              from './nav.js';
import { formatCurrency, toggleWatchlist,
         getWatchlist, showToast, getPrefs,
         setPref, getLogoColorClass }             from './utils.js';
import { openModal }                            from './modal.js';

// ── State
let allStartups   = [];
let activeFilter  = 'All';
let activeSort    = 'asking-desc';

// ── Init
initNav();
loadStartups();
restorePrefs();

// ── Fetch data
async function loadStartups() {
  try {
    const res  = await fetch('data/startups.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    allStartups = data;
    buildFilterButtons(data);
    renderListings(data);
    updateStats(data);
    renderWatchlistBanner();
  } catch (err) {
    console.error('Failed to load startups:', err);
    document.getElementById('listings-grid').innerHTML =
      `<div class="empty-state"><h3>Could not load listings</h3><p>${err.message}</p></div>`;
  }
}

// ── Build filter buttons from unique industries
function buildFilterButtons(data) {
  const industries = ['All', ...new Set(data.map(s => s.industry))].sort((a, b) =>
    a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b));

  const bar = document.getElementById('filter-buttons');
  bar.innerHTML = industries.map(ind =>
    `<button class="filter-chip${ind === activeFilter ? ' active' : ''}" data-filter="${ind}">${ind}</button>`
  ).join('');

  bar.addEventListener('click', (e) => {
    const actionButton = e.target.closest('.filter-chip');
    if (!actionButton) return;
    activeFilter = actionButton.dataset.filter;
    bar.querySelectorAll('.filter-chip').forEach(b => b.classList.toggle('active', b.dataset.filter === activeFilter));
    setPref('filter', activeFilter);
    applyFiltersAndSort();
  });
}

// ── Sort handler
document.getElementById('sort-select')?.addEventListener('change', (e) => {
  activeSort = e.target.value;
  setPref('sort', activeSort);
  applyFiltersAndSort();
});

// ── Filter + sort pipeline
function applyFiltersAndSort() {
  let filtered = activeFilter === 'All'
    ? [...allStartups]
    : allStartups.filter(s => s.industry === activeFilter);

  filtered = sortStartups(filtered, activeSort);
  renderListings(filtered);
}

function sortStartups(arr, sortKey) {
  return [...arr].sort((a, b) => {
    switch (sortKey) {
      case 'asking-asc':  return a.asking - b.asking;
      case 'asking-desc': return b.asking - a.asking;
      case 'mrr-desc':    return b.mrr - a.mrr;
      case 'name-asc':    return a.name.localeCompare(b.name);
      default:            return 0;
    }
  });
}

// ── Render cards
function renderListings(data) {
  const grid  = document.getElementById('listings-grid');
  const count = document.getElementById('listings-count');
  count.innerHTML = `Showing <strong>${data.length}</strong> listing${data.length !== 1 ? 's' : ''}`;

  if (data.length === 0) {
    grid.innerHTML = `<div class="empty-state">
      <h3>No listings found</h3>
      <p>Try a different industry filter.</p>
    </div>`;
    return;
  }

  const watchlist = getWatchlist();
  grid.innerHTML  = data.map(s => buildCard(s, watchlist)).join('');

  // Attach card events
  grid.querySelectorAll('.startup-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-watchlist') || e.target.closest('.card-cta')) return;
      const id = card.dataset.id;
      const startup = allStartups.find(s => s.id === id);
      if (startup) openModal(startup);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') card.click();
    });
  });

  grid.querySelectorAll('.card-watchlist').forEach(actionButton => {
    actionButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const id      = actionButton.dataset.id;
      const startup = allStartups.find(s => s.id === id);
      const result  = toggleWatchlist(id);
      actionButton.classList.toggle('saved', result.added);
      actionButton.setAttribute('aria-label', result.added ? 'Remove from watchlist' : 'Save to watchlist');
      if (result.added) {
        showToast(`${startup?.name} added to watchlist ♥`);
      } else {
        showToast(`${startup?.name} removed from watchlist`);
      }
      renderWatchlistBanner();
    });
  });

  grid.querySelectorAll('.card-cta').forEach(actionButton => {
    actionButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const id      = actionButton.dataset.id;
      const startup = allStartups.find(s => s.id === id);
      if (startup) openModal(startup);
    });
  });
}

function buildCard(s, watchlist) {
  const isSaved = watchlist.includes(s.id);
  const mrr     = formatCurrency(s.mrr);
  const asking  = formatCurrency(s.asking);
  const tags    = s.tags.slice(0, 2).map(t => `<span class="tag">${t}</span>`).join('');
  const trend   = `<span class="trend-badge ${s.trend}">${s.trend === 'up' ? '↑' : s.trend === 'down' ? '↓' : '→'}</span>`;

  return `
  <div class="startup-card" data-id="${s.id}" tabindex="0" role="listitem" aria-label="View details for ${s.name}">
    <div class="card-top">
      <div class="card-logo ${getLogoColorClass(s.logoColor)}">${s.logo}</div>
      <div class="card-meta">
        <p class="card-name">${s.name}</p>
        <span class="card-industry">${s.industry}</span>
      </div>
      <button class="card-watchlist ${isSaved ? 'saved' : ''}" data-id="${s.id}"
        aria-label="${isSaved ? 'Remove from watchlist' : 'Save to watchlist'}">
        ${isSaved ? '♥' : '♡'}
      </button>
    </div>
    <p class="card-desc">${s.description}</p>
    <div class="card-divider"></div>
    <div class="card-metrics">
      <div class="metric">
        <span class="metric-label">Asking</span>
        <span class="metric-value blue">${asking}</span>
      </div>
      <div class="metric">
        <span class="metric-label">MRR</span>
        <span class="metric-value">${mrr}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Multiple</span>
        <span class="metric-value">${s.multiple}</span>
      </div>
    </div>
    <div class="card-footer">
      <div class="card-tags">${tags} ${trend}</div>
      <button class="card-cta" data-id="${s.id}">View Deal →</button>
    </div>
  </div>`;
}

// ── Stats bar
function updateStats(data) {
  const totalAsking  = data.reduce((sum, s) => sum + s.asking, 0);
  const activeCount  = data.filter(s => s.stage !== 'Pre-Revenue').length;
  const avgMrr       = Math.round(data.filter(s => s.mrr > 0).reduce((sum, s) => sum + s.mrr, 0) /
                       data.filter(s => s.mrr > 0).length);

  document.getElementById('stat-listings').textContent  = data.length;
  document.getElementById('stat-active').textContent    = activeCount;
  document.getElementById('stat-asking').textContent    = formatCurrency(totalAsking);
  document.getElementById('stat-avg-mrr').textContent   = formatCurrency(avgMrr);
}

// ── Watchlist banner
function renderWatchlistBanner() {
  const banner = document.getElementById('watchlist-banner');
  if (!banner) return;
  const count = getWatchlist().length;
  banner.classList.toggle('hidden', count === 0);
  if (count > 0) {
    banner.querySelector('[data-count]').textContent = count;
  }
}

// ── Restore last saved prefs
function restorePrefs() {
  const prefs = getPrefs();
  if (prefs.filter) activeFilter = prefs.filter;
  if (prefs.sort) {
    activeSort = prefs.sort;
    const sel = document.getElementById('sort-select');
    if (sel) sel.value = activeSort;
  }
}
