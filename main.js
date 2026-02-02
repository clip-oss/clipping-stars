// ClippingStars Main JavaScript - Optimized

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initSmoothPageTransition();
  initLiveCounter();

  // Only init parallax on desktop
  if (window.innerWidth > 768) {
    initDashboardParallax();
  }
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
// Single IntersectionObserver for all animated elements
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .timeline-item, .result-item, [data-count]');

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Handle counter animation
        if (entry.target.hasAttribute('data-count') && !entry.target.classList.contains('counted')) {
          animateCounter(entry.target);
          entry.target.classList.add('counted');
        }

        // Unobserve after animation triggers
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  animatedElements.forEach(el => observer.observe(el));
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
function initSmoothPageTransition() {
  const links = document.querySelectorAll('a[href$=".html"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.hostname === window.location.hostname) {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
          window.location.href = link.href;
        }, 300);
      }
    });
  });

  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
  });
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

// ==================== DASHBOARD PARALLAX (Desktop Only) ====================
function initDashboardParallax() {
  const dashboard = document.getElementById('hero-dashboard');
  const floatingCards = document.getElementById('floating-cards');
  const statBubbles = document.getElementById('stat-bubbles');

  if (!dashboard) return;

  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const heroHeight = dashboard.offsetHeight;
    const scrollProgress = Math.min(scrolled / (heroHeight * 0.5), 1);

    if (floatingCards) {
      floatingCards.style.opacity = 1 - scrollProgress;
    }

    if (statBubbles) {
      statBubbles.style.opacity = 1 - scrollProgress;
    }

    if (scrollProgress > 0.3) {
      dashboard.classList.add('scrolled');
    } else {
      dashboard.classList.remove('scrolled');
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}
