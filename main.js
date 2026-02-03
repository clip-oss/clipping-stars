// ClippingStars Main JavaScript - Optimized

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initSmoothPageTransition();
  initLiveCounter();
  initApplyModal();
  initFaqToggles();
  initStepAnimations();
  // Parallax removed - floating cards should always stay visible
});

// ==================== NAVBAR ====================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.pageYOffset > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ==================== SCROLL ANIMATIONS ====================
// Only used for counter animations now - visibility handled by CSS defaults
function initScrollAnimations() {
  const counterElements = document.querySelectorAll('[data-count]');

  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Handle counter animation only
        if (!entry.target.classList.contains('counted')) {
          animateCounter(entry.target);
          entry.target.classList.add('counted');
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  counterElements.forEach(el => observer.observe(el));
}

// ==================== COUNTER ANIMATIONS ====================
function animateCounter(element) {
  const target = parseFloat(element.getAttribute('data-count'));
  const suffix = element.getAttribute('data-suffix') || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = progress * (2 - progress); // easeOutQuad
    const currentCount = target * eased;

    if (target >= 1000000000) {
      element.textContent = (currentCount / 1000000000).toFixed(1) + 'B' + suffix;
    } else if (target >= 1000000) {
      element.textContent = (currentCount / 1000000).toFixed(1) + 'M' + suffix;
    } else if (target >= 1000) {
      element.textContent = (currentCount / 1000).toFixed(0) + 'K' + suffix;
    } else {
      element.textContent = Math.round(currentCount) + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Set final value
      if (target >= 1000000000) {
        element.textContent = (target / 1000000000).toFixed(1) + 'B' + suffix;
      } else if (target >= 1000000) {
        element.textContent = (target / 1000000).toFixed(0) + 'M' + suffix;
      } else if (target >= 1000) {
        element.textContent = (target / 1000).toFixed(0) + 'K' + suffix;
      } else {
        element.textContent = target + suffix;
      }
    }
  }

  requestAnimationFrame(update);
}

// ==================== SMOOTH PAGE TRANSITIONS ====================
// Disabled - was causing content visibility issues
function initSmoothPageTransition() {
  // No longer manipulating body opacity - let content show immediately
}

// ==================== LIVE COUNTER ====================
function initLiveCounter() {
  const counter = document.getElementById('live-view-counter');
  if (!counter) return;

  const STORAGE_KEY = 'clippingstars_view_count';
  const TIMESTAMP_KEY = 'clippingstars_count_timestamp';
  const BASE_VALUE = 4600000000;
  const VIEWS_PER_SECOND = 15;

  function formatNumber(num) {
    return Math.floor(num).toLocaleString('en-US');
  }

  function getStoredValue() {
    const storedValue = sessionStorage.getItem(STORAGE_KEY);
    const storedTimestamp = sessionStorage.getItem(TIMESTAMP_KEY);

    if (storedValue && storedTimestamp) {
      const elapsed = (Date.now() - parseInt(storedTimestamp)) / 1000;
      const additionalViews = Math.floor(elapsed * VIEWS_PER_SECOND);
      return parseInt(storedValue) + additionalViews;
    }

    return BASE_VALUE;
  }

  function saveValue(value) {
    sessionStorage.setItem(STORAGE_KEY, value.toString());
    sessionStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
  }

  let currentValue = getStoredValue();
  let timeoutId = null;

  function tickCounter() {
    const increment = Math.floor(Math.random() * 50) + 1;
    currentValue += increment;
    counter.textContent = formatNumber(currentValue);
    saveValue(currentValue);
  }

  function scheduleNextTick() {
    const delay = Math.floor(Math.random() * 300) + 200;
    timeoutId = setTimeout(() => {
      tickCounter();
      scheduleNextTick();
    }, delay);
  }

  counter.textContent = formatNumber(currentValue);
  saveValue(currentValue);

  setTimeout(scheduleNextTick, 500);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (timeoutId) clearTimeout(timeoutId);
  });
}

// Dashboard parallax removed - floating cards should always stay visible

// ==================== HOW IT WORKS SCROLL ANIMATION ====================
function initStepAnimations() {
  const steps = document.querySelectorAll('.step');
  if (!steps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger the animations based on index
        const index = Array.from(steps).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 150);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  steps.forEach(step => observer.observe(step));
}

// ==================== FAQ TOGGLES ====================
function initFaqToggles() {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      item.classList.toggle('active');
    });
  });
}

// ==================== APPLY MODAL ====================
function initApplyModal() {
  const modal = document.getElementById('applyModal');
  const overlay = modal?.querySelector('.apply-overlay');
  const closeBtn = document.getElementById('applyClose');
  const form = document.getElementById('applyForm');
  const successMsg = document.getElementById('applySuccess');

  if (!modal) return;

  // Find all Apply Now buttons/links and attach click handlers
  const applyButtons = document.querySelectorAll('a[href="#cta"], .btn-primary');

  applyButtons.forEach(btn => {
    // Only handle buttons that contain "Apply" text or link to #cta
    const text = btn.textContent.toLowerCase();
    if (text.includes('apply') || btn.getAttribute('href') === '#cta') {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    }
  });

  // Open modal function
  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Reset form and success state
    if (form) form.style.display = 'block';
    if (successMsg) successMsg.style.display = 'none';
    if (form) form.reset();
  }

  // Close modal function
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close on overlay click
  if (overlay) {
    overlay.addEventListener('click', closeModal);
  }

  // Close on close button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Hide form, show success message
      form.style.display = 'none';
      if (successMsg) successMsg.style.display = 'block';

      // Auto-close after 3 seconds
      setTimeout(() => {
        closeModal();
      }, 3000);
    });
  }
}
