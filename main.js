// ClippingStars Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all functionality
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCounterAnimations();
  initLazyLoading();
  initSmoothPageTransition();
  initCarouselClickPause();
});

// ==================== NAVBAR ====================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
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

  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .timeline-item, .result-item');

  if (!animatedElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally stop observing after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

// ==================== COUNTER ANIMATIONS ====================
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');

  if (!counters.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        animateCounter(entry.target);
        entry.target.classList.add('counted');
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

function animateCounter(element) {
  const target = parseFloat(element.getAttribute('data-count'));
  const suffix = element.getAttribute('data-suffix') || '';
  const duration = 2000; // 2 seconds
  const frameDuration = 1000 / 60; // 60fps
  const totalFrames = Math.round(duration / frameDuration);
  let frame = 0;

  const easeOutQuad = t => t * (2 - t);

  const counter = setInterval(() => {
    frame++;
    const progress = easeOutQuad(frame / totalFrames);
    const currentCount = Math.round(target * progress * 10) / 10;

    if (target >= 1000000000) {
      // Billions
      element.textContent = (currentCount / 1000000000).toFixed(1) + 'B' + suffix;
    } else if (target >= 1000000) {
      // Millions
      element.textContent = (currentCount / 1000000).toFixed(1) + 'M' + suffix;
    } else if (target >= 1000) {
      // Thousands
      element.textContent = (currentCount / 1000).toFixed(0) + 'K' + suffix;
    } else {
      element.textContent = Math.round(currentCount) + suffix;
    }

    if (frame === totalFrames) {
      clearInterval(counter);
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
  }, frameDuration);
}

// ==================== LAZY LOADING IMAGES ====================
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if (!lazyImages.length) return;

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      img.classList.add('loaded');
    });
  }
}

// ==================== SMOOTH PAGE TRANSITIONS ====================
function initSmoothPageTransition() {
  // Add fade-out class on navigation
  const links = document.querySelectorAll('a[href$=".html"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      // Only handle internal links
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

  // Fade in on page load
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
  });
}

// ==================== CAROUSEL CLICK TO PAUSE ====================
function initCarouselClickPause() {
  const carousel = document.getElementById('results-carousel');
  if (!carousel) return;

  carousel.addEventListener('click', () => {
    carousel.classList.toggle('paused');
  });
}

// ==================== PARALLAX EFFECT ====================
function initParallax() {
  const parallaxBg = document.querySelector('.hero-bg');

  if (!parallaxBg) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
  });
}

// Initialize parallax if hero bg exists
if (document.querySelector('.hero-bg')) {
  initParallax();
}

// ==================== UTILITY FUNCTIONS ====================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
