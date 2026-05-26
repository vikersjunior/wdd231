const timestampField = document.getElementById('timestamp');

if (timestampField) {
  timestampField.value = new Date().toISOString();
}

const modalLinks = document.querySelectorAll('[data-modal-target]');
const closeButtons = document.querySelectorAll('[data-close-modal]');

modalLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const modalId = link.getAttribute('data-modal-target');
    const modal = document.getElementById(modalId);

    if (!modal) {
      return;
    }

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', 'open');
    }
  });
});

closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('dialog');

    if (modal) {
      modal.close();
    }
  });
});

document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});
