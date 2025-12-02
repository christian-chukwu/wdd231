// scripts/discover.js
// Module script to render discover items and manage visit messages
import { places } from '../data/discover.mjs';

const grid = document.getElementById('discover-grid');
const visitEl = document.getElementById('visit-message');

function formatDaysAgo(days) {
  if (days === 0) return 'Back so soon! Awesome!';
  if (days === 1) return 'You last visited 1 day ago.';
  return `You last visited ${days} days ago.`;
}

function showVisitMessage() {
  try {
    const last = localStorage.getItem('chamber-discover-last-visit');
    const now = Date.now();
    if (!last) {
      visitEl.textContent = 'Welcome! Let us know if you have any questions.';
    } else {
      const ms = now - Number(last);
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));
      if (days < 1) {
        visitEl.textContent = 'Back so soon! Awesome!';
      } else {
        visitEl.textContent = `You last visited ${days} ${days === 1 ? 'day' : 'days'} ago.`;
      }
    }
    localStorage.setItem('chamber-discover-last-visit', String(now));
  } catch (e) {
    console.warn('localStorage not available', e);
  }
}

function createCard(item) {
  const card = document.createElement('article');
  card.className = 'discover-card';
  card.setAttribute('data-id', item.id);

  const h2 = document.createElement('h2');
  h2.textContent = item.title;

  const figure = document.createElement('figure');
  const img = document.createElement('img');
  img.src = item.image;
  img.alt = item.title + ' photo';
  img.width = 300;
  img.height = 200;
  figure.appendChild(img);

  const addr = document.createElement('address');
  addr.textContent = item.address;

  const p = document.createElement('p');
  p.textContent = item.description;

  const btn = document.createElement('button');
  btn.className = 'learn-more';
  btn.textContent = 'Learn more';
  btn.addEventListener('click', () => {
    // Inline expand: toggle detailed description
    if (btn.getAttribute('aria-expanded') === 'true') {
      p.style.display = '';
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'Learn more';
    } else {
      p.style.display = 'block';
      btn.setAttribute('aria-expanded', 'true');
      btn.textContent = 'Show less';
    }
  });
  btn.setAttribute('aria-expanded', 'false');

  card.appendChild(h2);
  card.appendChild(figure);
  card.appendChild(addr);
  card.appendChild(p);
  card.appendChild(btn);

  return card;
}

function render() {
  if (!grid) return;
  places.forEach(item => {
    const card = createCard(item);
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  showVisitMessage();
  render();
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
