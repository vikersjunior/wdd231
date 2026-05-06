/**
 * date.js
 * Handles dynamic year and last modified date display
 */

document.addEventListener('DOMContentLoaded', function() {
    // Display current year
    const yearElement = document.getElementById('currentyear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Display last modified date
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        const lastModified = document.lastModified;
        lastModifiedElement.textContent = `Last Modification: ${lastModified}`;
    }
});
