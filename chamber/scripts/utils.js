// Utility functions for dates and other common functionality
document.addEventListener('DOMContentLoaded', () => {
  // Update copyright year
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Update last modified date
  const lastModifiedSpan = document.getElementById('lastModified');
  if (lastModifiedSpan) {
    lastModifiedSpan.textContent = document.lastModified;
  }
});