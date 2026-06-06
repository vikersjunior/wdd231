import { places } from '../data/discover.mjs';

const visitMessage = document.querySelector('#visit-message');
const discoverGrid = document.querySelector('#discover-grid');
const lastVisitKey = 'accraDiscoverLastVisit';

function renderVisitMessage() {
  if (!visitMessage) return;

  const today = Date.now();
  let previousVisit = 0;

  try {
    previousVisit = Number(localStorage.getItem(lastVisitKey));
  } catch (error) {
    previousVisit = 0;
  }

  if (!previousVisit) {
    visitMessage.textContent = 'Welcome! Let us know if you have any questions.';
  } else {
    const difference = today - previousVisit;
    const days = Math.floor(difference / 86400000);

    if (days < 1) {
      visitMessage.textContent = 'Back so soon! Awesome!';
    } else if (days === 1) {
      visitMessage.textContent = 'You last visited 1 day ago.';
    } else {
      visitMessage.textContent = `You last visited ${days} days ago.`;
    }
  }

  try {
    localStorage.setItem(lastVisitKey, String(today));
  } catch (error) {
    // Ignore storage failures so the page still renders normally.
  }
}

function buildDiscoverCard(place) {
  const card = document.createElement('article');
  card.className = 'discover-card';

  card.innerHTML = `
    <h2>${place.title}</h2>
    <figure class="discover-card-image">
      <img
        src="images/discover/${place.image}"
        alt="${place.title}"
        width="300"
        height="200"
        loading="lazy">
    </figure>

    <p>${place.description}</p>
    <address>${place.address}</address>
    <button class="learn-more" type="button">Learn More</button>
  `;

  return card;
}

function loadDiscoverCards() {
  if (!discoverGrid) return;

  const fragment = document.createDocumentFragment();

  places.slice(0, 8).forEach((place) => {
    fragment.appendChild(buildDiscoverCard(place));
  });

  discoverGrid.replaceChildren(fragment);
}

renderVisitMessage();
loadDiscoverCards();
