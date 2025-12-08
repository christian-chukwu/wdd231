/* Contact Form Script */

import { initializeNavigation, initializeFooter, setActiveNav } from './navigation.js';
import { saveToStorage } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  initializeFooter();
  setActiveNav('contact.html');

  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
});

function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;

  // Validate form
  if (!form.checkValidity()) {
    displayValidationErrors(form);
    return;
  }

  // Collect form data
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    category: formData.get('category'),
    message: formData.get('message'),
    subscribe: formData.get('subscribe') === 'on',
    submittedAt: new Date().toISOString()
  };

  // Save to local storage
  saveToStorage('last_form_submission', data);

  // Store in session for form results page
  sessionStorage.setItem('formData', JSON.stringify(data));

  // Redirect to form results page
  window.location.href = 'form-results.html';
}

function displayValidationErrors(form) {
  // Clear previous errors
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
  });

  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  let hasErrors = false;

  inputs.forEach(input => {
    if (!input.checkValidity()) {
      hasErrors = true;
      const errorElement = document.getElementById(`${input.id}-error`);

      if (errorElement) {
        var labelText = 'This field';
        try {
          if (input.labels && input.labels[0] && input.labels[0].textContent) {
            labelText = input.labels[0].textContent;
          }
        } catch (err) {
          // ignore and use default labelText
        }

        if (input.validity.valueMissing) {
          errorElement.textContent = labelText + ' is required.';
        } else if (input.validity.typeMismatch) {
          errorElement.textContent = 'Please enter a valid ' + input.type + '.';
        } else if (input.validity.tooShort) {
          errorElement.textContent = 'Minimum ' + (input.minLength || 0) + ' characters required.';
        }
      }

      // Visual focus
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      break;
    } else {
      input.setAttribute('aria-invalid', 'false');
    }
  });

  if (!hasErrors) {
    // Re-validate through HTML5 validation
    form.reportValidity();
  }
}
