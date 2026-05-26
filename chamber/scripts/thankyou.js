const params = new URLSearchParams(window.location.search);

const fieldMap = [
  ['firstName', 'display-first-name'],
  ['lastName', 'display-last-name'],
  ['email', 'display-email'],
  ['phone', 'display-phone'],
  ['organization', 'display-organization']
];

fieldMap.forEach(([paramName, elementId]) => {
  const value = params.get(paramName);
  const element = document.getElementById(elementId);

  if (element && value) {
    element.textContent = value;
  }
});

const timestampValue = params.get('timestamp');
const timestampElement = document.getElementById('display-timestamp');

if (timestampElement && timestampValue) {
  const parsed = new Date(timestampValue);
  timestampElement.textContent = Number.isNaN(parsed.getTime())
    ? timestampValue
    : parsed.toLocaleString('en-GH', {
        dateStyle: 'full',
        timeStyle: 'short'
      });
}
