/* Shared Navigation Module */

export function initializeNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('active');
    });

    // Close menu when a link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
      });
    });
  }
}

export function initializeFooter() {
  const currentYearSpan = document.getElementById('currentYear');
  const lastModifiedSpan = document.getElementById('lastModified');

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  if (lastModifiedSpan) {
    // Try to get document.lastModified first
    let lastModDate = document.lastModified;

    // If document.lastModified is empty or invalid, use current date
    if (!lastModDate || lastModDate.trim() === '' || lastModDate === '00/00/0000 00:00:00') {
      lastModDate = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    }

    lastModifiedSpan.textContent = lastModDate;
  }
}

export function setActiveNav(href) {
  document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === href) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}
