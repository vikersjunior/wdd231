// ── OpenWeatherMap config ─────────────────────────────────────
// Sign up free at openweathermap.org and replace with your key
const WEATHER_API_KEY = '577dc4424c7f5d28017682c1eb55d66d';
const CITY = 'Accra';
const COUNTRY_CODE = 'GH';
const UNITS = 'metric';

const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&units=${UNITS}&appid=${WEATHER_API_KEY}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY_CODE}&units=${UNITS}&cnt=24&appid=${WEATHER_API_KEY}`;

// ── DOM targets ───────────────────────────────────────────────
const tempEl        = document.getElementById('weather-temp');
const descEl        = document.getElementById('weather-desc');
const iconEl        = document.getElementById('weather-icon');
const highEl        = document.getElementById('weather-high');
const humidityEl    = document.getElementById('weather-humidity');
const windEl        = document.getElementById('weather-wind');
const forecastEl    = document.getElementById('weather-forecast');

// ── Day name helper ───────────────────────────────────────────
function getDayName(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString('en-GH', { weekday: 'long' });
}

// ── Capitalise description ────────────────────────────────────
function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function setWeatherIcon(iconUrl, description) {
  if (!iconEl) return;

  iconEl.classList.remove('is-loaded');

  const nextIcon = new Image();
  nextIcon.onload = () => {
    iconEl.src = iconUrl;
    iconEl.alt = description;
    iconEl.width = 64;
    iconEl.height = 64;
    iconEl.classList.add('is-loaded');
  };
  nextIcon.onerror = () => {
    iconEl.alt = description;
    iconEl.classList.remove('is-loaded');
  };
  nextIcon.src = iconUrl;
}

async function fetchWeatherJson(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    const message = data?.message ? `${response.status}: ${data.message}` : `${response.status}: Weather API error`;
    throw new Error(message);
  }

  return data;
}

// ── Render current weather ────────────────────────────────────
function renderCurrent(data) {
  const temp    = Math.round(data.main.temp);
  const high    = Math.round(data.main.temp_max);
  const desc    = cap(data.weather[0].description);
  const icon    = data.weather[0].icon;
  const humidity = data.main.humidity;
  const wind    = Math.round(data.wind.speed * 3.6); // m/s → km/h

  if (tempEl)     tempEl.textContent     = `${temp}°C`;
  if (descEl)     descEl.textContent     = desc;
  if (highEl)     highEl.textContent     = `High: ${high}°C`;
  if (humidityEl) humidityEl.textContent = `Humidity: ${humidity}%`;
  if (windEl)     windEl.textContent     = `Wind: ${wind} km/h`;

  if (iconEl) {
    setWeatherIcon(`https://openweathermap.org/img/wn/${icon}@2x.png`, desc);
  }
}

// ── Build 3-day forecast from 3-hourly data ───────────────────
function renderForecast(data) {
  if (!forecastEl) return;

  // Group by day — pick the noon reading for each future day
  const days = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const key  = date.toDateString();
    const hour = date.getHours();

    // Prefer noon (12) reading; fall back to first entry per day
    if (!days[key] || Math.abs(hour - 12) < Math.abs(new Date(days[key].dt * 1000).getHours() - 12)) {
      days[key] = item;
    }
  });

  // Skip today, take next 3 days
  const today   = new Date().toDateString();
  const entries = Object.entries(days)
    .filter(([key]) => key !== today)
    .slice(0, 3);

  forecastEl.innerHTML = entries.map(([, item]) => `
    <div class="forecast-day">
      <p class="forecast-label">${getDayName(item.dt)}</p>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png"
           alt="${cap(item.weather[0].description)}"
           width="40" height="40" loading="lazy">
      <p class="forecast-temp">${Math.round(item.main.temp)}°C</p>
      <p class="forecast-desc">${cap(item.weather[0].description)}</p>
    </div>
  `).join('');
}

// ── Fetch & render ────────────────────────────────────────────
async function loadWeather() {
  try {
    const [currentData, forecastData] = await Promise.all([
      fetchWeatherJson(weatherUrl),
      fetchWeatherJson(forecastUrl)
    ]);

    renderCurrent(currentData);
    renderForecast(forecastData);
  } catch (err) {
    console.error('Weather load failed:', err);
    if (tempEl) tempEl.textContent = '--°C';
    if (descEl) descEl.textContent = 'Weather unavailable';
    if (highEl) highEl.textContent = 'High: --°C';
    if (humidityEl) humidityEl.textContent = 'Humidity: --%';
    if (windEl) windEl.textContent = 'Wind: -- km/h';
    if (iconEl) {
      iconEl.classList.remove('is-loaded');
      iconEl.alt = 'Weather unavailable';
    }

    if (forecastEl) {
      forecastEl.innerHTML = `<p class="weather-error">${err.message}</p>`;
    }
  }
}

loadWeather();
