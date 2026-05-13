const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {
    // Create elements
    let card = document.createElement('section');
    let fullName = document.createElement('h2');
    let portrait = document.createElement('img');
    let birthdate = document.createElement('p');
    let birthplace = document.createElement('p');

    // Populate heading with full name
    fullName.textContent = `${prophet.name} ${prophet.lastname}`;

    // Populate birth info
    birthdate.innerHTML = `<span class="label">Date of Birth:</span> ${prophet.birthdate}`;
    birthplace.innerHTML = `<span class="label">Place of Birth:</span> ${prophet.birthplace}`;

    // Build image with all required attributes
    portrait.setAttribute('src', prophet.imageurl);
    portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
    portrait.setAttribute('loading', 'lazy');
    portrait.setAttribute('width', '340');
    portrait.setAttribute('height', '440');

    // Append elements to card
    card.appendChild(fullName);
    card.appendChild(portrait);
    card.appendChild(birthdate);
    card.appendChild(birthplace);

    // Append card to grid
    cards.appendChild(card);
  });
};

async function getProphetData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    //console.table(data.prophets);
    displayProphets(data.prophets);
  } catch (error) {
    console.error('Error fetching prophet data:', error);
  }
}

getProphetData();