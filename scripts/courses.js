const courses = [
  {
    subject: 'CSE',
    number: 110,
    title: 'Intro to Programming',
    credits: 3,
    completed: true,
    status: 'completed'
  },
  {
    subject: 'WDD',
    number: 130,
    title: 'Web Fundamentals',
    credits: 3,
    completed: true,
    status: 'completed'
  },
  {
    subject: 'CSE',
    number: 111,
    title: 'Programming with Functions',
    credits: 3,
    completed: true,
    status: 'completed'
  },
  {
    subject: 'CSE',
    number: 210,
    title: 'Data Structures',
    credits: 3,
    completed: false,
    status: 'not-started'
  },
  {
    subject: 'WDD',
    number: 131,
    title: 'Dynamic Web Fundamentals',
    credits: 3,
    completed: true,
    status: 'completed'
  },
  {
    subject: 'WDD',
    number: 231,
    title: 'Frontend Web Development I',
    credits: 3,
    completed: false,
    status: 'in-progress'
  }
];

function getStatusLabel(status) {
  switch (status) {
    case 'completed':    return '✓ Completed';
    case 'not-started':  return 'Not Started';
    case 'in-progress':  return 'In Progress';
    default:             return status;
  }
}

function renderCourses(filter) {
  const grid = document.getElementById('courses-container');
  const totalEl = document.getElementById('total-credits');
  if (!grid || !totalEl) return;

  const filtered = filter === 'all'
    ? courses
    : courses.filter(c => c.subject.toLowerCase() === filter.toLowerCase());

  // Use reduce for total credits — rubric requirement
  const total = filtered.reduce((sum, c) => sum + c.credits, 0);
  totalEl.textContent = total;

  grid.innerHTML = filtered.map(course => `
    <div class="course-card">
      <span class="course-code">${course.subject} ${course.number}</span>
      <p class="course-title">${course.title}</p>
      <div class="course-info">
        <span class="course-credits">${course.credits} Credits</span>
        <span class="course-status ${course.status}" aria-label="Status: ${getStatusLabel(course.status)}">
          ${getStatusLabel(course.status)}
        </span>
      </div>
    </div>
  `).join('');
}

function initCourses() {
  let activeFilter = 'all';
  renderCourses(activeFilter);

  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      activeFilter = btn.dataset.filter;
      renderCourses(activeFilter);
    });
  });
}

document.addEventListener('DOMContentLoaded', initCourses);
