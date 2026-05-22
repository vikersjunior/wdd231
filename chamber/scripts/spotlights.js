// ── Spotlight: random 2–3 gold/silver members ─────────────────
const spotlightGrid = document.getElementById('spotlight-grid');

function getMembershipInfo(level) {
  switch (level) {
    case 3: return { label: '★ Gold', cls: 'gold' };
    case 2: return { label: '◆ Silver', cls: 'silver' };
    default: return { label: 'Member', cls: 'member' };
  }
}

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('');
}

function getWebsiteLabel(url) {
  return url.replace(/^https?:\/\//, '');
}

function buildSpotlightCard(member) {
  const { label, cls } = getMembershipInfo(member.membership);

  const card = document.createElement('article');
  card.className = 'member-card';
  card.innerHTML = `
    <div class="card-header">
      <div class="card-logo-placeholder" aria-hidden="true">${getInitials(member.name)}</div>
      <div>
        <p class="card-name">${member.name}</p>
        <p class="card-tagline">${member.tagline}</p>
      </div>
    </div>
    <div class="card-body">
      <div class="card-detail">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span>${member.address}</span>
      </div>
      <div class="card-detail">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
        <span>${member.phone}</span>
      </div>
      <div class="card-detail">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>
        <a href="${member.website}" target="_blank" rel="noopener noreferrer">${getWebsiteLabel(member.website)}</a>
      </div>
    </div>
    <div class="card-footer">
      <span class="membership-badge ${cls}">${label}</span>
    </div>
  `;
  return card;
}

// Shuffle array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function loadSpotlights() {
  if (!spotlightGrid) return;
  try {
    const res  = await fetch('data/members.json');
    const data = await res.json();

    // Filter gold (3) and silver (2) only
    const eligible = data.members.filter(m => m.membership >= 2);

    // Randomly pick 2 or 3
    const count    = Math.random() < 0.5 ? 2 : 3;
    const selected = shuffle(eligible).slice(0, count);

    spotlightGrid.innerHTML = '';
    selected.forEach(member => {
      spotlightGrid.appendChild(buildSpotlightCard(member));
    });
  } catch (err) {
    console.error('Spotlight load failed:', err);
    if (spotlightGrid) spotlightGrid.innerHTML = '<p>Spotlights unavailable.</p>';
  }
}

loadSpotlights();
