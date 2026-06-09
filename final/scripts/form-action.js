import { initNav } from './nav.js';
initNav();

// Field label mapping
const labels = {
  startup_name:  'Startup Name',
  industry:      'Industry',
  asking_price:  'Asking Price (USD)',
  mrr:           'Monthly Revenue (USD)',
  founded:       'Year Founded',
  location:      'Location',
  team_size:     'Team Size',
  stage:         'Deal Stage',
  description:   'Description',
  reason:        'Reason for Selling',
  email:         'Contact Email',
  consent:       'Consent'
};

const params = new URLSearchParams(window.location.search);
const tbody  = document.getElementById('data-rows');

if (params.size === 0) {
  tbody.innerHTML = `<tr><td colspan="2" class="empty-data">
    No submission data found. <a href="list.html" class="link-accent">Go back to the form.</a>
  </td></tr>`;
} else {
  const rows = Array.from(params.entries())
    .filter(([key]) => key !== 'consent')
    .map(([key, value]) => {
      const label = labels[key] || key.replace(/_/g, ' ');
      const display = value.length > 200 ? value.slice(0, 200) + '…' : value;
      return `<tr>
        <td>${label}</td>
        <td>${display || '—'}</td>
      </tr>`;
    }).join('');

  tbody.innerHTML = rows || `<tr><td colspan="2">No data fields found.</td></tr>`;
}
