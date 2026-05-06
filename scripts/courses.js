/**
 * courses.js
 * Handles course data, display, filtering, and credit calculations
 */

// Course data array
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Intro to Programming',
        credits: 3,
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 3,
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 3,
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Data Structures',
        credits: 4,
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 3,
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 3,
        completed: false
    }
];

// DOM Elements
const coursesContainer = document.getElementById('courses-container');
const totalCreditsElement = document.getElementById('total-credits');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    displayCourses(courses);
    updateTotalCredits(courses);
    setupFilterButtons();
});

/**
 * Display courses in the DOM
 * @param {Array} coursesToDisplay - Array of course objects to display
 */
function displayCourses(coursesToDisplay) {
    if (!coursesContainer) return;

    coursesContainer.innerHTML = '';

    coursesToDisplay.forEach(course => {
        const courseCard = createCourseCard(course);
        coursesContainer.appendChild(courseCard);
    });
}

/**
 * Create a course card element
 * @param {Object} course - Course object
 * @returns {HTMLElement} Course card element
 */
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    
    // Add 'completed' class if course is completed
    if (course.completed) {
        card.classList.add('completed');
    }

    const courseCodeHTML = `<span class="course-code">${course.subject} ${course.number}</span>`;
    
    const completedBadgeHTML = course.completed 
        ? '<span class="completed-badge">✓ Completed</span>' 
        : '';

    card.innerHTML = `
        ${courseCodeHTML}
        <h4 class="course-title">${course.title}</h4>
        <p class="course-credits">${course.credits} Credits</p>
        ${completedBadgeHTML}
    `;

    return card;
}

/**
 * Update total credits display based on displayed courses
 * @param {Array} displayedCourses - Array of currently displayed courses
 */
function updateTotalCredits(displayedCourses) {
    if (!totalCreditsElement) return;

    // Use reduce to calculate total credits
    const totalCredits = displayedCourses.reduce((sum, course) => {
        return sum + course.credits;
    }, 0);

    totalCreditsElement.textContent = totalCredits;
}

/**
 * Filter courses by subject
 * @param {String} subject - Subject code (CSE, WDD, or 'all')
 */
function filterCourses(subject) {
    let filteredCourses;

    if (subject === 'all') {
        filteredCourses = courses;
    } else {
        filteredCourses = courses.filter(course => course.subject === subject);
    }

    displayCourses(filteredCourses);
    updateTotalCredits(filteredCourses);
}

/**
 * Setup event listeners for filter buttons
 */
function setupFilterButtons() {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');

            // Filter courses based on button ID
            const filterId = this.getAttribute('id');
            let subject = 'all';

            if (filterId === 'cse-btn') {
                subject = 'CSE';
            } else if (filterId === 'wdd-btn') {
                subject = 'WDD';
            }

            filterCourses(subject);
        });
    });
}
