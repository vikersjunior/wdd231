document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('currentyear');
  const modEl = document.getElementById('lastModified');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (modEl) {
    const d = new Date(document.lastModified);
    const pad = n => String(n).padStart(2, '0');
    modEl.textContent = `Last Modification: ${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
});
