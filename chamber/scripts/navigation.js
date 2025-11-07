// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menu-button');
  const nav = document.querySelector('nav');

  menuButton.addEventListener('click', () => {
    nav.classList.toggle('show');
    const isExpanded = nav.classList.contains('show');
    menuButton.setAttribute('aria-expanded', isExpanded);
  });
});