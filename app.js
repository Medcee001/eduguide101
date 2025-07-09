document.addEventListener('DOMContentLoaded', function() {
  // All 30 courses with icons and URLs

 
let courses = [];

async function fetchCourses() {
  const token = localStorage.getItem('token');
  if (!token) return alert('Please login to view courses.');

  try {
    const res = await fetch('http://localhost:5000/api/courses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch courses');
    }

    const data = await res.json();
    courses = data;
    renderCourses();
  } catch (err) {
    alert(err.message);
  }
}


  // DOM Elements
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const loginModal = document.getElementById('login-modal');
  const signupModal = document.getElementById('signup-modal');
  const closeModals = document.querySelectorAll('.close-modal');
  const switchToLogin = document.getElementById('switch-to-login');
  const switchToSignup = document.getElementById('switch-to-signup');
  const categoryFilter = document.getElementById('category');
  const difficultyFilter = document.getElementById('difficulty');
  const coursesGrid = document.querySelector('.all-courses .courses-grid');
  const searchInput = document.querySelector('.search-box input');
  // Auth Form Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Handle Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      loginModal.classList.remove('active');
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert('Login failed. Try again.');
  }
});

// Handle Signup
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;

  if (password !== confirm) {
    alert('Passwords do not match.');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Signup successful! You can log in now.');
      signupModal.classList.remove('active');
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert('Signup failed. Try again.');
  }

  if (res.ok) {
  localStorage.setItem('token', data.token);
  alert('Login successful!');
  loginModal.classList.remove('active');
  fetchCourses(); // Refresh courses after login
}

});


  // Render all courses
  function fetchCourses(coursesToRender = courses) {
    coursesGrid.innerHTML = '';
    
    coursesToFetch.forEach(course => {
      const courseCard = document.createElement('div');
      courseCard.className = 'course-card';
      courseCard.dataset.category = course.category;
      courseCard.dataset.difficulty = course.difficulty;
      
      courseCard.innerHTML = `
        <div class="course-image" style="background-image: url('${course.image}')"></div>
        <div class="course-info">
          <h4><i class="${course.icon}"></i> ${course.title}</h4>
          <p>${course.description}</p>
          <div class="course-meta">
            <span class="difficulty ${course.difficulty}">${course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}</span>
            <span class="category">${getCategoryName(course.category)}</span>
          </div>
          <button class="view-course" onclick="window.open('${course.url}', '_blank')">
            <i class="fas fa-external-link-alt"></i> View Course
          </button>
        </div>
      `;
      
      coursesGrid.appendChild(courseCard);
    });
  }

  // Helper function to get full category name
  function getCategoryName(categoryCode) {
    const categories = {
      web: 'Web Development',
      data: 'Data Science',
      ai: 'Artificial Intelligence',
      mobile: 'Mobile Development',
      cloud: 'Cloud Computing'
    };
    return categories[categoryCode] || categoryCode;
  }

  // Filter Courses
  function filterCourses(category = 'all') {
    const selectedCategory = category || categoryFilter.value;
    const selectedDifficulty = difficultyFilter.value;

    const filteredCourses = courses.filter(course => {
      const categoryMatch = selectedCategory === 'all' || course.category === selectedCategory;
      const difficultyMatch = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });

    fetchCourses(filteredCourses);
  }

  // Search Courses
  function searchCourses() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm.trim() === '') {
      filterCourses();
      return;
    }

    const filteredCourses = courses.filter(course => {
      return (
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        getCategoryName(course.category).toLowerCase().includes(searchTerm)
      );
    });

    fetchCourses(filteredCourses);
  }

  // Event Listeners
  loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
  });

  signupBtn.addEventListener('click', () => {
    signupModal.classList.add('active');
  });

  closeModals.forEach(btn => {
    btn.addEventListener('click', () => {
      loginModal.classList.remove('active');
      signupModal.classList.remove('active');
    });
  });

  switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.classList.remove('active');
    loginModal.classList.add('active');
  });

  switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('active');
    signupModal.classList.add('active');
  });

  window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.classList.remove('active');
    }
    if (e.target === signupModal) {
      signupModal.classList.remove('active');
    }
  });

  categoryFilter.addEventListener('change', () => filterCourses());
  difficultyFilter.addEventListener('change', () => filterCourses());
  searchInput.addEventListener('input', searchCourses);

  // Make filterCourses available globally for category cards
  window.filterCourses = filterCourses;

  // Initialize
  fetchCourses();
});