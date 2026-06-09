import { initNav } from './nav.js';
import { showToast } from './utils.js';

initNav();

// Pre-fill from URL param (set when "Contact Founder" is clicked from a modal)
const params  = new URLSearchParams(window.location.search);
const interest = params.get('interest');
if (interest) {
  const notice = document.getElementById('interest-notice');
  notice.style.display = 'block';
}

// Client-side validation
const form = document.getElementById('listing-form');
form.addEventListener('submit', (e) => {
  const errorBox = document.getElementById('form-error');
  const required = form.querySelectorAll('[required]');
  let errors = [];

  required.forEach(field => {
    if (field.type === 'checkbox' && !field.checked) {
      errors.push('Please check the consent box before submitting.');
    } else if (field.type !== 'checkbox' && !field.value.trim()) {
      const label = form.querySelector(`label[for="${field.id}"]`);
      errors.push(`${label ? label.textContent.replace('*','').trim() : 'A required field'} is missing.`);
    }
  });

  if (errors.length > 0) {
    e.preventDefault();
    errorBox.classList.add('show');
    errorBox.innerHTML = `<strong>Please fix the following:</strong><ul>${
      [...new Set(errors)].map(err => `<li>${err}</li>`).join('')
    }</ul>`;
    errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});
