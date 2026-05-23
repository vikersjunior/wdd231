const membersContainer = document.querySelector('#members-container');
const memberCountEl = document.querySelector('#member-count');
const gridBtn = document.querySelector('#grid-btn');
const listBtn = document.querySelector('#list-btn');
const SKELETON_CARD_COUNT = 8;

// ── Membership level label + badge class ──────────────────────
function getMembershipInfo(level) {
  switch (level) {
    case 3: return { label: '★ Gold', cls: 'gold' };
    case 2: return { label: '◆ Silver', cls: 'silver' };
    default: return { label: 'Member', cls: 'member' };
  }
}

// ── Get first letter(s) for placeholder logo ──────────────────
function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('');
}

// ── Build one member card ─────────────────────────────────────
function buildCard(member) {
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
      <p class="card-list-name">${member.name}</p>
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
        <a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website.replace('https://', '')}</a>
      </div>
    </div>
    <div class="card-footer">
      <span class="membership-badge ${cls}">${label}</span>
    </div>
  `;
  return card;
}

function buildSkeletonCard() {
  const card = document.createElement('article');
  card.className = 'member-card is-skeleton';
  card.setAttribute('aria-hidden', 'true');
  card.innerHTML = `
    <div class="card-header">
      <div class="card-logo-placeholder">AA</div>
      <div>
        <div class="card-line name-line"></div>
        <div class="card-line tagline-line"></div>
      </div>
    </div>
    <div class="card-body">
      <div class="card-detail">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <div class="card-line detail-line"></div>
      </div>
      <div class="card-detail">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
        <div class="card-line detail-line"></div>
      </div>
      <div class="card-detail">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>
        <div class="card-line detail-line"></div>
      </div>
    </div>
    <div class="card-footer">
      <span class="membership-badge member">Loading</span>
    </div>
  `;
  return card;
}

function renderSkeletonCards(count = SKELETON_CARD_COUNT) {
  if (!membersContainer) return;

  const fragment = document.createDocumentFragment();
  for (let index = 0; index < count; index += 1) {
    fragment.appendChild(buildSkeletonCard());
  }

  membersContainer.replaceChildren(fragment);
  membersContainer.setAttribute('aria-busy', 'true');
}

// ── Display all members ───────────────────────────────────────
const displayMembers = (members) => {
  const fragment = document.createDocumentFragment();
  members.forEach(member => {
    fragment.appendChild(buildCard(member));
  });

  membersContainer.replaceChildren(fragment);
  membersContainer.setAttribute('aria-busy', 'false');

  if (memberCountEl) {
    memberCountEl.textContent = members.length;
  }
};

// ── Fetch members from JSON ───────────────────────────────────
async function getMembers() {
  try {
    const response = await fetch('data/members.json');
    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    console.error('Error loading members:', error);
    membersContainer.setAttribute('aria-busy', 'false');
    membersContainer.innerHTML = '<p>Unable to load member directory. Please try again later.</p>';
  }
}

// ── Grid / List toggle ────────────────────────────────────────
gridBtn.addEventListener('click', () => {
  membersContainer.classList.remove('list-view');
  gridBtn.classList.add('active');
  listBtn.classList.remove('active');
  gridBtn.setAttribute('aria-pressed', 'true');
  listBtn.setAttribute('aria-pressed', 'false');
});

listBtn.addEventListener('click', () => {
  membersContainer.classList.add('list-view');
  listBtn.classList.add('active');
  gridBtn.classList.remove('active');
  listBtn.setAttribute('aria-pressed', 'true');
  gridBtn.setAttribute('aria-pressed', 'false');
});

// ── Init ──────────────────────────────────────────────────────
renderSkeletonCards();
getMembers();