/* Home Page Main Script */

import { initializeNavigation, initializeFooter, setActiveNav } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  initializeFooter();
  setActiveNav('index.html');

  // Setup modal for information
  const modal = document.getElementById('info-modal');
  if (modal) {
    const closeBtn = modal.querySelector('#modal-close');

    closeBtn?.addEventListener('click', () => {
      modal.close();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.close();
      }
    });
  }
});
