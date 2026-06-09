// utils.js — Shared utility functions

/**
 * Format a number as USD currency (compact)
 * e.g. 48000 → "$48k"
 */
export function formatCurrency(value) {
  if (!value || value === 0) return '—';
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return `$${value}`;
}

const logoColorMap = {
  '#0047B3': 'logo-color-0061fe',
  '#0061FE': 'logo-color-0061fe',
  '#059669': 'logo-color-059669',
  '#06B6D4': 'logo-color-06b6d4',
  '#0891B2': 'logo-color-0891b2',
  '#10B981': 'logo-color-10b981',
  '#15803D': 'logo-color-15803d',
  '#1D4ED8': 'logo-color-1d4ed8',
  '#22C55E': 'logo-color-22c55e',
  '#7C3AED': 'logo-color-7c3aed',
  '#84CC16': 'logo-color-84cc16',
  '#8B5CF6': 'logo-color-8b5cf6',
  '#BE185D': 'logo-color-be185d',
  '#D97706': 'logo-color-d97706',
  '#DC2626': 'logo-color-dc2626',
  '#EC4899': 'logo-color-ec4899',
  '#EF4444': 'logo-color-ef4444',
  '#F59E0B': 'logo-color-f59e0b',
  '#F97316': 'logo-color-f97316',
  '#FCD34D': 'logo-color-fcd34d',
  '#FF6B35': 'logo-color-ff6b35'
};

export function getLogoColorClass(color) {
  return logoColorMap[color] || 'logo-color-default';
}

/**
 * Show a brief toast notification
 */
export function showToast(message, icon = '✓') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${icon}</span> ${message}`;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/**
 * Get watchlist array from localStorage
 */
export function getWatchlist() {
  try {
    return JSON.parse(localStorage.getItem('agh_watchlist') || '[]');
  } catch {
    return [];
  }
}

/**
 * Save watchlist array to localStorage
 */
export function saveWatchlist(list) {
  localStorage.setItem('agh_watchlist', JSON.stringify(list));
}

/**
 * Toggle a startup ID on the watchlist
 * Returns { added: bool, count: number }
 */
export function toggleWatchlist(id) {
  const list = getWatchlist();
  const idx  = list.indexOf(id);
  if (idx === -1) {
    list.push(id);
    saveWatchlist(list);
    return { added: true, count: list.length };
  } else {
    list.splice(idx, 1);
    saveWatchlist(list);
    return { added: false, count: list.length };
  }
}

/**
 * Load and parse user preferences from localStorage
 */
export function getPrefs() {
  try {
    return JSON.parse(localStorage.getItem('agh_prefs') || '{}');
  } catch {
    return {};
  }
}

/**
 * Save a single preference key-value
 */
export function setPref(key, value) {
  const prefs = getPrefs();
  prefs[key] = value;
  localStorage.setItem('agh_prefs', JSON.stringify(prefs));
}
