// Home page script: weather widget and member spotlights
document.addEventListener('DOMContentLoaded', () => {
  // Fill footer info
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  document.getElementById('lastModified').textContent = document.lastModified || 'Unknown';

  // Initialize features
  loadSpotlights();
  loadWeather();
});

/* --- Spotlights: fetch members.json, filter silver/gold, randomize and display 2-3 --- */
async function loadSpotlights() {
  const container = document.getElementById('spotlight-list');
  container.innerHTML = '<p>Loading spotlights...</p>';

  try {
    const res = await fetch('data/members.json');
    const json = await res.json();
    const members = json.members || [];

    // Filter for silver (2) or gold (3)
    const eligible = members.filter(m => m.membershipLevel >= 2);
    if (!eligible.length) {
      container.innerHTML = '<p>No spotlights available at this time.</p>';
      return;
    }

    // Shuffle and pick 2 or 3 randomly (prefers 3 if available)
    const shuffled = eligible.sort(() => Math.random() - 0.5);
    const count = Math.min(shuffled.length, Math.random() > 0.5 ? 3 : 2);
    const pick = shuffled.slice(0, count);

    container.innerHTML = '';
    pick.forEach(member => {
      const card = document.createElement('article');
      card.className = 'spotlight-card';

      card.innerHTML = `
        <img src="images/${member.image}" alt="${member.name} logo">
        <h4>${member.name} ${getMembershipBadge(member.membershipLevel)}</h4>
        <p>📍 ${member.address}</p>
        <p>📞 ${member.phone}</p>
        <p><a href="${member.website}" target="_blank" rel="noopener">Visit Website</a></p>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error('Spotlights load error:', err);
    container.innerHTML = '<p>Error loading spotlights.</p>';
  }
}

function getMembershipBadge(level) {
  const badges = {
    1: { emoji: '🥉', label: 'Bronze', className: 'membership-bronze' },
    2: { emoji: '🥈', label: 'Silver', className: 'membership-silver' },
    3: { emoji: '🥇', label: 'Gold', className: 'membership-gold' }
  };
  const b = badges[level] || null;
  if (!b) return '';
  return `<span class="membership-badge ${b.className}">${b.emoji} ${b.label}</span>`;
}

/* --- Weather: OpenWeatherMap One Call (requires API key) --- */
async function loadWeather() {
  const widget = document.getElementById('weather-widget');
  widget.innerHTML = '<p>Loading weather...</p>';

  // Look for API key in a few places: global window var, meta tag
  const API_KEY = (window && window.OPENWEATHER_API_KEY) || document.querySelector('meta[name="openweather-key"]')?.content || '';

  // Abidjan coordinates
  const lat = 5.359952;
  const lon = -4.008256;
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`;

  // If there's no API key, show sample data and instructions instead of failing
  if (!API_KEY) {
    try {
      const sampleRes = await fetch('data/weather-sample.json');
      const sample = await sampleRes.json();
      renderWeather(widget, sample, true);
    } catch (err) {
      console.error('Unable to load sample weather:', err);
      widget.innerHTML = '<p>Please add your OpenWeatherMap API key in <code>chamber/scripts/config.js</code> to show live weather.</p>';
    }
    return;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API error');
    const data = await res.json();

    renderWeather(widget, data, false);

  } catch (err) {
    console.error('Weather load error:', err);
    widget.innerHTML = '<p>Unable to load weather right now.</p>';
  }
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function renderWeather(widget, data, isSample = false) {
  const current = data.current;
  const daily = data.daily || [];

  const currentHtml = `
    <div class="current">
      <div>
        <strong>${Math.round(current.temp)}°C</strong>
        <div>${capitalize(current.weather[0].description)}</div>
      </div>
      <div>
        <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="${current.weather[0].description}" width="64" height="64">
      </div>
    </div>
  `;

  // 3-day forecast (skip today)
  const forecastHtml = (daily.slice(1, 4).map(day => {
    const date = new Date(day.dt * 1000);
    return `
      <div class="day">
        <div>${date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
        <div>${Math.round(day.temp.day)}°C</div>
      </div>
    `;
  }) || []).join('');

  widget.innerHTML = `${currentHtml}<div class="forecast">${forecastHtml}</div>`;
}
