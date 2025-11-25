// thankyou.js - moves inline thankyou logic into external file
// Parse query params and show required fields
(function () {
  const params = new URLSearchParams(location.search);
  const set = (id, key) => {
    const el = document.getElementById(id);
    if (el) el.textContent = params.get(key) || '—';
  };
  set('r-first', 'firstName');
  set('r-last', 'lastName');
  set('r-email', 'email');
  set('r-mobile', 'mobile');
  set('r-org', 'organization');
  set('r-ts', 'timestamp');
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
