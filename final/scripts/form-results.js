/* Form Results Page Script - Display submitted form data */

import { initializeNavigation, initializeFooter } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  initializeFooter();

  const resultsContent = document.getElementById('results-content');

  // Get form data from sessionStorage (set during form submission)
  const formDataStr = sessionStorage.getItem('formData');
  // Try sessionStorage first; if missing (JS disabled earlier), parse URL query params as a fallback
  if (formDataStr) {
    try {
      const formData = JSON.parse(formDataStr);
      displayFormResults(formData, resultsContent);
      return;
    } catch (error) {
      console.error('Error parsing form data from sessionStorage:', error);
    }
  }

  // Fallback: parse URL query parameters (works when form submits with method=GET)
  const params = new URLSearchParams(window.location.search);
  if ([...params.keys()].length === 0) {
    resultsContent.innerHTML = `
      <div class="alert-info" role="alert">
        <p>No form data found. Please <a href="contact.html">submit the contact form</a> first.</p>
      </div>
    `;
    return;
  }

  const fallbackData = {
    name: params.get('name') || '',
    email: params.get('email') || '',
    subject: params.get('subject') || '',
    category: params.get('category') || '',
    message: params.get('message') || '',
    subscribe: params.get('subscribe') === 'on' || params.get('subscribe') === 'true',
    submittedAt: new Date().toISOString()
  };

  displayFormResults(fallbackData, resultsContent);
});

function displayFormResults(data, container) {
  const submittedDate = new Date(data.submittedAt).toLocaleString();

  const html = `
    <h3>Thank you for your submission!</h3>
    <p>Here's a summary of the information you provided:</p>
    
    <dl>
      <dt>Name:</dt>
      <dd>${escapeHtml(data.name)}</dd>
      
      <dt>Email:</dt>
      <dd><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></dd>
      
      <dt>Subject:</dt>
      <dd>${escapeHtml(data.subject)}</dd>
      
      <dt>Category:</dt>
      <dd>${data.category ? escapeHtml(data.category) : 'Not specified'}</dd>
      
      <dt>Message:</dt>
      <dd>${escapeHtml(data.message).replace(/\n/g, '<br>')}</dd>
      
      <dt>Subscribed to Updates:</dt>
      <dd>${data.subscribe ? 'Yes' : 'No'}</dd>
      
      <dt>Submitted At:</dt>
      <dd>${submittedDate}</dd>
    </dl>
  `;

  container.innerHTML = html;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
