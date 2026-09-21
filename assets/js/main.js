/**
 * HARVEST & HEARTH — CORE APPLICATION JAVASCRIPT
 * Handles navigation, mobile drawer, dark/light theme toggle, RTL mode,
 * hero micro-interactions, testimonials slider, and client-side form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavigation();
  initHeaderScroll();
  initTestimonialsSlider();
  initFormValidation();
  initHeroAnimations();
  highlightActiveNavLink();
  initBackToTop();
  initFAQAccordion();
});

/* ==========================================================================
   1. THEME SWITCHER (DARK / LIGHT MODE)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('hh_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

  applyTheme(currentTheme);

  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('hh_theme', newTheme);
    });
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  const icons = document.querySelectorAll('.theme-toggle-btn i');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'ri-sun-line';
    } else {
      icon.className = 'ri-moon-line';
    }
  });
}

/* ==========================================================================
   2. RTL TOGGLE (STEP 5)
   ========================================================================== */
function initRTL() {
  const savedRTL = localStorage.getItem('hh_rtl');
  if (savedRTL === 'true') {
    enableRTL(true);
  }

  const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
  rtlToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      enableRTL(!isRTL);
      localStorage.setItem('hh_rtl', (!isRTL).toString());
    });
  });
}

function enableRTL(enable) {
  if (enable) {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.classList.add('rtl');
  } else {
    document.documentElement.removeAttribute('dir');
    document.body.classList.remove('rtl');
  }
  window.dispatchEvent(new Event('dirchange'));
}

/* ==========================================================================
   3. NAVIGATION & MOBILE DRAWER (STEP 4)
   ========================================================================== */
function initNavigation() {
  const hamburger = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeBtn = document.querySelector('.drawer-close');

  if (!hamburger || !drawer) return;

  function openDrawer() {
    drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  const drawerLinks = drawer.querySelectorAll('.drawer-link, .drawer-footer a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   4. TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialsSlider() {
  const slider = document.querySelector('.testimonials-slider');
  if (!slider) return;

  const track = slider.querySelector('.testimonial-track');
  const slides = slider.querySelectorAll('.testimonial-slide');
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  function updateSlider() {
    const offset = currentIndex * -100;
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    track.style.transform = `translateX(${isRTL ? -offset : offset}%)`;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    });
  }

  // Touch swipe support for mobile and tablet devices
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    // Only trigger slide navigation if horizontal gesture is greater than vertical and > 35px
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      if ((diffX > 0 && !isRTL) || (diffX < 0 && isRTL)) {
        currentIndex = (currentIndex + 1) % totalSlides;
      } else {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      }
      updateSlider();
    }
  }, { passive: true });

  window.addEventListener('resize', updateSlider);
  window.addEventListener('dirchange', updateSlider);
}

/* ==========================================================================
   5. CLIENT-SIDE FORM VALIDATION (STEP 12)
   ========================================================================== */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate="true"]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate inputs, selects, textareas
      const fields = form.querySelectorAll('input, select, textarea');
      fields.forEach(field => {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      // Terms checkbox check
      const termsCheckbox = form.querySelector('input[name="terms"]');
      if (termsCheckbox && !termsCheckbox.checked) {
        isValid = false;
        const group = termsCheckbox.closest('.form-group');
        if (group) group.classList.add('has-error');
      }

      if (isValid) {
        // Show success banner
        const successBanner = form.querySelector('.form-success-banner');
        if (successBanner) {
          successBanner.classList.add('active');
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Reset inputs after subtle timeout
        setTimeout(() => {
          form.reset();
          form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('has-success', 'has-error');
          });
        }, 3000);
      }
    });

    // Real-time input listener
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        validateField(field);
      });
      field.addEventListener('blur', () => {
        validateField(field);
      });
    });
  });
}

function validateField(field) {
  const group = field.closest('.form-group');
  if (!group) return true;

  const errorMsg = group.querySelector('.form-error-msg');
  const isRequired = field.hasAttribute('required');
  const val = field.value.trim();
  let valid = true;
  let customMsg = '';

  if (isRequired && !val) {
    valid = false;
    customMsg = 'This field is required.';
  } else if (field.type === 'email' && val) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      valid = false;
      customMsg = 'Please enter a valid email address.';
    }
  } else if (field.name === 'password' && val) {
    if (val.length < 8) {
      valid = false;
      customMsg = 'Password must be at least 8 characters.';
    }
  } else if (field.name === 'confirm_password') {
    const pwd = field.form.querySelector('input[name="password"]');
    if (pwd && val !== pwd.value) {
      valid = false;
      customMsg = 'Passwords do not match.';
    }
  }

  if (!valid) {
    group.classList.add('has-error');
    group.classList.remove('has-success');
    if (errorMsg && customMsg) {
      errorMsg.textContent = customMsg;
    }
  } else {
    group.classList.remove('has-error');
    if (val) {
      group.classList.add('has-success');
    } else {
      group.classList.remove('has-success');
    }
  }

  return valid;
}

/* ==========================================================================
   6. HERO ANIMATIONS & COUNTERS
   ========================================================================== */
function initHeroAnimations() {
  const metricValues = document.querySelectorAll('.hero-metric-value[data-target]');
  if (metricValues.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        let start = 0;
        const duration = 1500;
        const stepTime = 25;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(start) + suffix;
          }
        }, stepTime);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  metricValues.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. BACK TO TOP BUTTON (ALL DEVICES)
   ========================================================================== */
function initBackToTop() {
  let backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.className = 'back-to-top-btn';
    backToTopBtn.setAttribute('type', 'button');
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.setAttribute('title', 'Back to top');
    backToTopBtn.innerHTML = '<i class="ri-arrow-up-line"></i>';
    document.body.appendChild(backToTopBtn);
  }

  let isScrolling = false;
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
    isScrolling = false;
  };

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(toggleVisibility);
      isScrolling = true;
    }
  }, { passive: true });

  toggleVisibility();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   10. FAQ ACCORDION (EXCLUSIVE EXPANSION)
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.open) {
            otherItem.removeAttribute('open');
          }
        });
      }
    });
  });
}

