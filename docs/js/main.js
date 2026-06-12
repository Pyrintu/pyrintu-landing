// =====================
// FORM HANDLER
// =====================

const form = document.getElementById('contact-form');
const messageDiv = document.getElementById('form-message');
const emailInput = document.getElementById('email');

if (form) {
  form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  
  // Validate email
  if (!isValidEmail(email)) {
    showMessage('✗ Please enter a valid email address', 'error');
    return;
  }
  
  // Show loading state
  showMessage('⏳ Adding you to the waitlist...', 'loading');
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  
  try {
    // For now, just simulate success
    // TODO: Replace with Formspree endpoint
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showMessage('✓ Success! Check your email for next steps.', 'success');
    form.reset();
    button.disabled = false;
  } catch (error) {
    console.error('Form error:', error);
    showMessage('✗ Something went wrong. Please try again.', 'error');
    button.disabled = false;
  }
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `form-message ${type}`;
  
  // Auto-clear success/error after 5 seconds
  if (type !== 'loading') {
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = 'form-message';
    }, 5000);
  }
}

// =====================
// SMOOTH SCROLL
// =====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// =====================
// MOBILE MENU
// =====================

const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('mobile-open');
  });
  
  // Close menu on link click
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
    });
  });
}

// =====================
// SCROLL ANIMATIONS
// =====================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'all 0.6s ease-out';
  observer.observe(section);
});

console.log('✓ Pyrintu landing page loaded');