// join.js: timestamp population and modal behavior for join.html
document.addEventListener('DOMContentLoaded', () => {
  // populate footer info
  const y = new Date().getFullYear();
  const currentYear = document.getElementById('currentYear');
  if (currentYear) currentYear.textContent = y;
  const lastModified = document.getElementById('lastModified');
  if (lastModified) lastModified.textContent = document.lastModified || 'Unknown';

  // populate timestamp hidden field with ISO string
  const ts = document.getElementById('timestamp');
  if (ts) ts.value = new Date().toISOString();

  // Modal content for each membership level
  const modalInfo = {
    'modal-np': '<h4>NP Membership — Non-Profit</h4><p>No membership fee; access to community programs, networking and support.</p>',
    'modal-bronze': '<h4>Bronze Membership</h4><p>Directory listing, event announcements, and limited promotional opportunities.</p>',
    'modal-silver': '<h4>Silver Membership</h4><p>Spotlight opportunities, workshops, and moderate promotional features.</p>',
    'modal-gold': '<h4>Gold Membership</h4><p>Priority listings, prime spotlights, advertising opportunities, and event discounts.</p>'
  };

  const backdrop = document.getElementById('modal-backdrop');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');

  function openModal(id) {
    modalContent.innerHTML = modalInfo[id] || '';
    backdrop.style.display = 'flex';
    backdrop.setAttribute('aria-hidden', 'false');
    // trap focus: focus close button
    modalClose && modalClose.focus();
  }

  function closeModal() {
    backdrop.style.display = 'none';
    backdrop.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const id = el.getAttribute('data-modal');
      openModal(id);
    });
  });

  modalClose && modalClose.addEventListener('click', closeModal);
  backdrop && backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

  // close on Escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
});
