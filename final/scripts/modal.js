// modal.js — Modal dialog module
import { formatCurrency, toggleWatchlist, getWatchlist, showToast, getLogoColorClass } from './utils.js';

let backdrop, modalEl;

function buildModal() {
  backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-labelledby', 'modal-heading');
  backdrop.innerHTML = `
    <div class="modal" id="modal-panel">
      <div class="modal-header">
        <div class="modal-logo" id="modal-logo"></div>
        <div class="modal-title-block">
          <h2 id="modal-heading"></h2>
          <div class="modal-badges" id="modal-badges"></div>
        </div>
        <button class="modal-close" id="modal-close" aria-label="Close dialog">✕</button>
      </div>
      <div class="modal-body" id="modal-body"></div>
    </div>`;
  document.body.appendChild(backdrop);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  modalEl = backdrop;
}

export function openModal(startup) {
  if (!modalEl) buildModal();

  const watchlist = getWatchlist();
  const isSaved   = watchlist.includes(startup.id);

  // Header
  const modalLogo = document.getElementById('modal-logo');
  modalLogo.textContent  = startup.logo;
  modalLogo.className = `modal-logo ${getLogoColorClass(startup.logoColor)}`;
  document.getElementById('modal-heading').textContent = startup.name;

  const badges = document.getElementById('modal-badges');
  badges.innerHTML = `
    <span class="card-industry">${startup.industry}</span>
    <span class="trend-badge ${startup.trend}">${startup.trend === 'up' ? '↑ Growing' : startup.trend === 'down' ? '↓ Declining' : '→ Stable'}</span>
    <span class="tag">${startup.stage}</span>`;

  // Body
  const mrr     = formatCurrency(startup.mrr);
  const asking  = formatCurrency(startup.asking);
  const annRev  = formatCurrency(startup.annualRev);
  const tagHtml = startup.tags.map(t => `<span class="tag">${t}</span>`).join('');

  document.getElementById('modal-body').innerHTML = `
    <div class="modal-metrics">
      <div class="modal-metric">
        <span class="label">Asking Price</span>
        <span class="value blue">${asking}</span>
      </div>
      <div class="modal-metric">
        <span class="label">MRR</span>
        <span class="value">${mrr}</span>
      </div>
      <div class="modal-metric">
        <span class="label">Multiple</span>
        <span class="value">${startup.multiple}</span>
      </div>
    </div>

    <div class="modal-section">
      <h3>About</h3>
      <p>${startup.description}</p>
    </div>

    <div class="modal-section">
      <h3>Why Selling</h3>
      <p>${startup.reason}</p>
    </div>

    <div class="modal-section">
      <h3>Deal Details</h3>
      <div class="modal-detail-grid">
        <div class="modal-detail-item">
          <p class="d-label">Annual Revenue</p>
          <p class="d-value">${annRev}</p>
        </div>
        <div class="modal-detail-item">
          <p class="d-label">Team Size</p>
          <p class="d-value">${startup.team} people</p>
        </div>
        <div class="modal-detail-item">
          <p class="d-label">Users / Customers</p>
          <p class="d-value">${startup.users > 0 ? startup.users.toLocaleString() : '—'}</p>
        </div>
        <div class="modal-detail-item">
          <p class="d-label">Founded</p>
          <p class="d-value">${startup.founded}</p>
        </div>
        <div class="modal-detail-item">
          <p class="d-label">Location</p>
          <p class="d-value">${startup.location}, Ghana</p>
        </div>
        <div class="modal-detail-item">
          <p class="d-label">Status</p>
          <p class="d-value">${startup.status}</p>
        </div>
      </div>
    </div>

    <div class="modal-section">
      <h3>Tags</h3>
      <div class="modal-tags">${tagHtml}</div>
    </div>

    <div class="modal-actions">
      <button class="action-link action-primary" id="modal-contact-action">
        Contact Founder →
      </button>
      <button class="action-link action-ghost" id="modal-watchlist-action" data-id="${startup.id}">
        ${isSaved ? '♥ Saved' : '♡ Watchlist'}
      </button>
    </div>`;

  // Watchlist toggle inside modal
  document.getElementById('modal-watchlist-action').addEventListener('click', () => {
    const result = toggleWatchlist(startup.id);
    const actionButton    = document.getElementById('modal-watchlist-action');
    if (result.added) {
      actionButton.textContent = '♥ Saved';
      showToast(`${startup.name} added to watchlist`);
    } else {
      actionButton.textContent = '♡ Watchlist';
      showToast(`${startup.name} removed from watchlist`);
    }
    // Sync card button if visible
    const cardBtn = document.querySelector(`.card-watchlist[data-id="${startup.id}"]`);
    if (cardBtn) {
      cardBtn.classList.toggle('saved', result.added);
      cardBtn.textContent = result.added ? '♥' : '♡';
      cardBtn.setAttribute('aria-label', result.added ? 'Remove from watchlist' : 'Save to watchlist');
      cardBtn.setAttribute('aria-pressed', result.added ? 'true' : 'false');
    }
    updateWatchlistBanner();
  });

  document.getElementById('modal-contact-action').addEventListener('click', () => {
    closeModal();
    window.location.href = `list.html?interest=${encodeURIComponent(startup.name)}`;
  });

  // Open
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close').focus();
}

export function closeModal() {
  if (!modalEl) return;
  modalEl.classList.remove('open');
  document.body.style.overflow = '';
}

function updateWatchlistBanner() {
  const banner = document.getElementById('watchlist-banner');
  if (!banner) return;
  const count = getWatchlist().length;
  if (count > 0) {
    banner.classList.remove('hidden');
    banner.querySelector('strong').textContent = count;
  } else {
    banner.classList.add('hidden');
  }
}
