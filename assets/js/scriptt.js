/* =========================================================
   GLOBALS + DOM
========================================================= */
// ===== GLOBAL VARIABLES =====
let isLoading = true;
let scrollPosition = 0;
let ticking = false;

// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById('loading-screen');
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const backToTop = document.getElementById('backToTop');
const contactModal = document.getElementById('contactModal');
const modalClose = document.getElementById('modalClose');


/* =========================================================
   HELPERS
========================================================= */

/** Helper: Debounce */
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

/** Helper: Throttle */
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}


/* =========================================================
   AUTH: Supabase session detection (localStorage)
========================================================= */
/** Check if user has valid Supabase session stored in localStorage */
function hasValidSupabaseSessionInStorage() {
  try {
    const now = Math.floor(Date.now() / 1000);

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;

      // Supabase typically stores session in: sb-<project-ref>-auth-token
      if (k.startsWith('sb-') && k.endsWith('-auth-token')) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;

        let obj;
        try {
          obj = JSON.parse(raw);
        } catch {
          continue;
        }

        const sess = obj?.currentSession ?? obj;
        const token = sess?.access_token;
        const exp = sess?.expires_at;

        if (token) {
          if (typeof exp === 'number') {
            if (exp > now + 30) return true;
          } else {
            return true;
          }
        }
      }
    }
  } catch (e) {
    console.log('Session storage check error:', e);
  }
  return false;
}


/* =========================================================
   PROGRESS BAR
========================================================= */
/** Update top progress bar on scroll */
function initProgressBar() {
  window.addEventListener('scroll', () => {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (scrollHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }

    const scrollPercent = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}


/* =========================================================
   LOADING SCREEN
========================================================= */
/** Hide loading screen safely */
function hideLoadingScreen(immediate = false) {
  if (!loadingScreen) return;

  const finish = () => {
    loadingScreen.style.display = 'none';
    isLoading = false;

    // initialize animations AFTER loading is hidden
    if (typeof initializeAnimations === 'function') initializeAnimations();
  };

  loadingScreen.style.opacity = '0';

  if (immediate) {
    finish();
    return;
  }

  setTimeout(finish, 500);
}

/** Initialize loading screen behavior (show once) */
function initLoadingScreen() {
  window.addEventListener('load', () => {
    if (!loadingScreen) return;

    const seen = localStorage.getItem('seen_loading_v2') === '1';
    const loggedIn = hasValidSupabaseSessionInStorage();

    // Hide immediately if shown before OR already logged in
    if (seen || loggedIn) {
      localStorage.setItem('seen_loading_v2', '1');
      hideLoadingScreen(true);
      return;
    }

    // First time only
    localStorage.setItem('seen_loading_v2', '1');

    // Hard fallback
    const hardTimeout = setTimeout(() => hideLoadingScreen(true), 7000);

    // Original timing
    setTimeout(() => {
      clearTimeout(hardTimeout);
      hideLoadingScreen(false);
    }, 4500);
  });
}


/* =========================================================
   HEADER SCROLL EFFECT + BACK TO TOP
========================================================= */
/** Update header style + back-to-top visibility */
function updateHeader() {
  if (ticking) return;

  requestAnimationFrame(() => {
    const currentScroll = window.pageYOffset;

    if (header) {
      if (currentScroll > 100) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }

    if (backToTop) {
      if (currentScroll > 300) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    }

    scrollPosition = currentScroll;
    ticking = false;
  });

  ticking = true;
}

/** Init header scroll */
function initHeaderScroll() {
  window.addEventListener('scroll', updateHeader);
}


/* =========================================================
   SMOOTH SCROLL
========================================================= */
/** Smooth scroll to a selector with header offset */
function smoothScrollTo(targetSelector, duration = 700) {
  const targetElement = document.querySelector(targetSelector);
  if (!targetElement) return;

  const headerEl = document.querySelector('.header');
  const headerHeight = headerEl ? headerEl.offsetHeight : 0;

  const targetPosition = targetElement.offsetTop - headerHeight - 20;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}

/** Smooth scroll for internal anchor links only */
function initInternalAnchorSmoothScroll() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href || href === '#') return;

    // Only prevent default for # links
    e.preventDefault();
    smoothScrollTo(href, 700);
  });
}


/* =========================================================
   MOBILE NAVIGATION (Hamburger)
========================================================= */
/**
 * Important Fix:
 * - Do NOT preventDefault for page links (/student//dashboard.html)
 * - Only smooth scroll for #links
 * - Close menu after any click
 */
function initMobileNavigation() {
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });

  // Close menu when clicking any nav link
  navMenu.addEventListener('click', (e) => {
    const link = e.target.closest('a.nav-link');
    if (!link) return;

    const href = link.getAttribute('href') || '';

    // If link is internal section (#...), we do smooth scroll
    if (href.startsWith('#') && href !== '#') {
      e.preventDefault();
      smoothScrollTo(href, 700);
    }
    // else: page link -> allow default navigation naturally

    // Close menu after click
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('nav-open');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('nav-open');
    }
  });
}


/* =========================================================
   BACK TO TOP
========================================================= */
/** Init back-to-top */
function initBackToTop() {
  if (!backToTop) return;
  backToTop.addEventListener('click', () => smoothScrollTo('body', 700));
}


/* =========================================================
   MODAL (Contact)
========================================================= */
/** Open modal by id */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    const content = modal.querySelector('.modal-content');
    if (!content) return;
    content.style.transform = 'translate(-50%, -50%) scale(1)';
    content.style.opacity = '1';
  }, 10);
}

/** Close modal by id */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  const content = modal.querySelector('.modal-content');
  if (content) {
    content.style.transform = 'translate(-50%, -50%) scale(0.8)';
    content.style.opacity = '0';
  }

  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }, 300);
}

/** Init contact modal listeners */
function initContactModal() {
  if (modalClose) modalClose.addEventListener('click', () => closeModal('contactModal'));

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeModal('contactModal');
    });
  }
}


/* =========================================================
   FORMS
========================================================= */
/** Initialize demo form submit handlers */
function initializeForms() {
  const forms = document.querySelectorAll('form');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
        form.reset();

        if (form.closest('.modal')) closeModal('contactModal');
      }, 2000);
    });
  });
}


/* =========================================================
   NOTIFICATIONS
========================================================= */
/** Show notification toast */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    </div>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#3b82f6'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    max-width: 400px;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  const closeBtn = notification.querySelector('.notification-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    });
  }

  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}


/* =========================================================
   SCROLL ANIMATIONS + COUNTERS + PARALLAX
========================================================= */
/** Init intersection animations */
function initializeScrollAnimations() {
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('animate-in');

      if (
        entry.target.classList.contains('service-card') ||
        entry.target.classList.contains('university-card')
      ) {
        const siblings = Array.from(entry.target.parentNode.children);
        const index = siblings.indexOf(entry.target);
        entry.target.style.animationDelay = `${index * 0.1}s`;
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(`
    .service-card,
    .university-card,
    .contact-item,
    .feature-item,
    .stat-item
  `);

  animatedElements.forEach((el) => observer.observe(el));
}

/** Counter animation */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');

  counters.forEach((counter) => {
    const target = parseInt(counter.textContent.replace(/\D/g, ''), 10);
    if (!target) return;

    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const originalText = counter.textContent;
    const hasPercent = originalText.includes('%');
    const hasPlus = originalText.includes('+');

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      if (hasPercent) counter.textContent = Math.floor(current) + '%';
      else if (hasPlus) counter.textContent = Math.floor(current) + '+';
      else counter.textContent = Math.floor(current);
    }, 16);
  });
}

/** Parallax for hero shapes */
function initializeParallax() {
  const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
  if (!parallaxElements.length) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    parallaxElements.forEach((element, index) => {
      const speed = (index + 1) * 0.2;
      element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
  });
}


/* =========================================================
   LAZY LOADING
========================================================= */
/** Init images lazy-loading */
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}


/* =========================================================
   WHATSAPP
========================================================= */
/** Track WhatsApp button clicks (demo) */
function initializeWhatsApp() {
  const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
  whatsappButtons.forEach((button) => {
    button.addEventListener('click', () => console.log('WhatsApp button clicked'));
  });
}


/* =========================================================
   SEARCH
========================================================= */
/** Initialize search input behavior (if exists) */
function initializeSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  const searchResults = document.getElementById('search-results');
  const searchableContent = document.querySelectorAll('[data-searchable]');

  searchInput.addEventListener(
    'input',
    debounce((e) => {
      const query = e.target.value.toLowerCase().trim();

      if (query.length < 2) {
        if (searchResults) searchResults.style.display = 'none';
        return;
      }

      const results = [];
      searchableContent.forEach((element) => {
        const text = element.textContent.toLowerCase();
        if (text.includes(query)) {
          results.push({
            title: element.dataset.title || element.textContent.substring(0, 50),
            element: element,
          });
        }
      });

      displaySearchResults(results);
    }, 300)
  );
}

/** Render search results */
function displaySearchResults(results) {
  const searchResults = document.getElementById('search-results');
  if (!searchResults) return;

  if (!results.length) {
    searchResults.innerHTML = '<p>لم يتم العثور على نتائج</p>';
  } else {
    searchResults.innerHTML = results
      .map(
        (result) => `
      <div class="search-result-item" data-target="${result.element.id}">
        ${result.title}
      </div>
    `
      )
      .join('');

    // click handler (event delegation)
    searchResults.onclick = (e) => {
      const item = e.target.closest('.search-result-item');
      if (!item) return;
      const targetId = item.dataset.target;
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        smoothScrollTo(`#${targetId}`, 700);
        searchResults.style.display = 'none';
      }
    };
  }

  searchResults.style.display = 'block';
}


/* =========================================================
   ACCESSIBILITY
========================================================= */
/** Accessibility improvements (ESC closes modals/menu) */
function initializeAccessibility() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    // close open modals
    const openModals = document.querySelectorAll('.modal[style*="display: block"]');
    openModals.forEach((m) => closeModal(m.id));

    // close mobile menu
    if (navMenu && navMenu.classList.contains('active')) {
      hamburger?.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('nav-open');
    }
  });

  const focusableElements = document.querySelectorAll(`
    a[href],
    button:not([disabled]),
    textarea:not([disabled]),
    input:not([disabled]),
    select:not([disabled]),
    [tabindex]:not([tabindex="-1"])
  `);

  focusableElements.forEach((el) => {
    el.addEventListener('focus', () => el.classList.add('focused'));
    el.addEventListener('blur', () => el.classList.remove('focused'));
  });
}


/* =========================================================
   DARK MODE (optional)
========================================================= */
/** Dark mode toggle support if button exists */
function initializeDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (!darkModeToggle) return;

  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  darkModeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}


/* =========================================================
   COOKIE CONSENT (optional)
========================================================= */
/** Basic cookie consent */
function initializeCookieConsent() {
  const cookieConsent = document.getElementById('cookie-consent');
  const acceptCookies = document.getElementById('accept-cookies');

  if (!cookieConsent || localStorage.getItem('cookiesAccepted')) return;

  setTimeout(() => {
    cookieConsent.style.display = 'block';
  }, 2000);

  if (acceptCookies) {
    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieConsent.style.display = 'none';
    });
  }
}


/* =========================================================
   ANALYTICS (demo)
========================================================= */
/** Track event (demo) */
function trackEvent(eventName, eventData = {}) {
  console.log('Event tracked:', eventName, eventData);

  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventData);
  }
}


/* =========================================================
   FAQ
========================================================= */
/** Initialize FAQ accordion */
function initializeFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    if (!item.classList.contains('active')) answer.style.maxHeight = '0px';

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains('active')) {
          const otherAnswer = other.querySelector('.faq-answer');
          other.classList.remove('active');
          if (otherAnswer) otherAnswer.style.maxHeight = '0px';
        }
      });

      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        setTimeout(() => {
          if (item.classList.contains('active')) answer.style.maxHeight = 'none';
        }, 400);
      }
    });

    window.addEventListener('resize', () => {
      if (item.classList.contains('active')) {
        answer.style.maxHeight = 'none';
        const height = answer.scrollHeight;
        answer.style.maxHeight = '0px';
        setTimeout(() => (answer.style.maxHeight = height + 'px'), 10);
      }
    });
  });
}


/* =========================================================
   LIVE STREAM (your existing feature)
   NOTE: cleaned closeModal naming conflict by using closeLiveStreamModal()
========================================================= */
function initializeLiveStream() {
  const liveStreamBtn = document.getElementById('liveStreamBtn');
  const liveStreamModal = document.getElementById('liveStreamModal');
  const liveStreamClose = document.getElementById('liveStreamClose');
  const joinStreamBtn = document.getElementById('joinStreamBtn');
  const scheduleCallBtn = document.getElementById('scheduleCallBtn');
  const chatInput = document.getElementById('chatInput');
  const sendMessage = document.getElementById('sendMessage');
  const chatMessages = document.getElementById('chatMessages');
  const viewerCount = document.getElementById('viewerCount');

  let viewerNumber = 127;

  const sampleMessages = [
    { username: 'خالد المصري', text: 'بدي أتواصل معكم شخصياً كيف؟', isAdmin: false },
    { username: 'مستشار الجوابرة', text: 'أكيد! تواصل معنا مباشرة عبر <a href="https://wa.me/message/EUGNIXH6NHRZL1" target="_blank">اضغط هنا للتواصل على واتساب</a>، وسنرد عليك فوراً إن شاء الله.', isAdmin: true },
    { username: 'خالد الزعبي', text: 'هل أقدر أشتغل وأنا طالب؟', isAdmin: false },
    { username: 'مستشار الجوابرة', text: 'بالجامعات الخاصة مش مسموح تشتغل بشكل رسمي، لكن في فرص شغل جزئي ببعض الأماكن', isAdmin: true },
    { username: 'فرح سلامة', text: 'هل في سكن جامعي؟', isAdmin: false },
    { username: 'مستشار الجوابرة', text: 'أغلب الجامعات بتوفر سكن طلابي، وفي كمان سكنات خاصة قريبة من الجامعة', isAdmin: true },
    { username: 'ياسر أبو جابر', text: 'هل في رسوم عند التقديم؟', isAdmin: false },
    { username: 'مستشار الجوابرة', text: 'التقديم عن طريقنا مجاني بالكامل للجامعات الخاصة', isAdmin: true },
    { username: 'رامي خليل', text: 'شو الأوراق المطلوبة للتسجيل؟', isAdmin: false },
    { username: 'مستشار الجوابرة', text: 'صورة جواز السفر، شهادة الثانوية، كشف العلامات، وصورة شخصية، وبعض الجامعات تطلب شهادة لغة', isAdmin: true },
    { username: 'دعاء منصور', text: 'ممكن أقدم بدون امتحان يوس أو سات؟', isAdmin: false },
    { username: 'مستشار الجوابرة', text: 'نعم، الجامعات الخاصة ما بتطلب يوس أو سات، التقديم بيكون مباشرة عن طريق الشهادة الثانوية', isAdmin: true },
    { username: 'نورا عادل', text: 'هل في جامعات بتركيا معترف فيها بدول الخليج؟', isAdmin: false },
    { username: 'مستشار الجوابرة', text: 'نعم، في جامعات معترف فيها في السعودية والإمارات وقطر، حسب الجامعة والتخصص', isAdmin: true },
    { username: 'أحمد مجدي', text: 'متى ببدأ الفصل الدراسي؟', isAdmin: false },
    { username: 'مستشار الجوابرة', text: 'الفصل الأول بيبدأ عادة بشهر 9، والفصل الثاني بشهر 2', isAdmin: true },
    { username: 'لينا عماد', text: 'هل في تخصصات طبية بدون دراسة باللغة التركية؟', isAdmin: false },
    { username: 'مستشار الجوابرة', text: 'نعم، في تخصصات طبية مثل الطب البشري وطب الأسنان متوفرة بالإنجليزي ببعض الجامعات', isAdmin: true },
    { username: 'سامي الدويك', text: 'كم تكلفة الدراسة السنوية؟', isAdmin: false },
    { username: 'مستشار الجوابرة', text: 'التكلفة بتختلف حسب التخصص، مثلاً الطب من 10-20 ألف دولار، أما التخصصات الهندسية أو الإدارية من 2-6 آلاف بالسنة', isAdmin: true },
    { username: 'رغد شهاب', text: 'ممكن أغير تخصصي بعد التسجيل؟', isAdmin: false },
    { username: 'مستشار الجوابرة', text: 'بعض الجامعات بتسمح بتغيير التخصص قبل بدء الدراسة أو بعد أول فصل بشروط معينة', isAdmin: true },
  ];

  // Add message to chat
  function addMessage(username, text, isAdmin) {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isAdmin ? 'admin' : ''}`;
    messageDiv.innerHTML = `
      <div class="message-content">
        <span class="username">${username}</span>
        <span class="text" style="font-weight:bold;">${text}</span>
      </div>
      <div class="time" style="display:block;margin-top:5px;font-size:.8em;color:BLACK;text-align:left;">${time}</div>
    `;

    if (chatMessages) {
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  // Viewer counter
  function startViewerCountAnimation() {
    setInterval(() => {
      viewerNumber += Math.floor(Math.random() * 5) - 2;
      if (viewerNumber < 100) viewerNumber = 100;
      if (viewerNumber > 200) viewerNumber = 200;

      if (viewerCount) viewerCount.textContent = `${viewerNumber} مشاهد متصل`;

      const onlineCount = document.querySelector('.online-count');
      if (onlineCount) onlineCount.textContent = `${viewerNumber} متصل`;
    }, 5000);
  }

  // Auto messages
  let autoMessageInterval;
  let messageCount = 0;
  let autoMessagesStarted = false;

  function startAutoMessages() {
    if (autoMessagesStarted) return;
    autoMessagesStarted = true;

    autoMessageInterval = setInterval(() => {
      if (messageCount < sampleMessages.length) {
        const msg = sampleMessages[messageCount++];
        addMessage(msg.username, msg.text, msg.isAdmin);
      } else {
        clearInterval(autoMessageInterval);
      }
    }, 800 + Math.random() * 5000);
  }

  function stopAutoMessages() {
    if (autoMessageInterval) clearInterval(autoMessageInterval);
    autoMessagesStarted = false;
  }

  function closeLiveStreamModal() {
    if (!liveStreamModal) return;
    liveStreamModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    stopAutoMessages();
  }

  // Open
  if (liveStreamBtn && liveStreamModal) {
    liveStreamBtn.addEventListener('click', () => {
      liveStreamModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      startViewerCountAnimation();
      startAutoMessages();
    });
  }

  // Close
  if (liveStreamClose) liveStreamClose.addEventListener('click', closeLiveStreamModal);

  if (liveStreamModal) {
    liveStreamModal.addEventListener('click', (e) => {
      if (e.target === liveStreamModal) closeLiveStreamModal();
    });
  }

  // Buttons
  if (joinStreamBtn) {
    joinStreamBtn.addEventListener('click', () => {
      showNotification('سيتم توجيهك إلى البث المباشر قريباً...', 'info');
      setTimeout(() => window.open('https://wa.me/message/EUGNIXH6NHRZL1', '_blank'), 2000);
    });
  }

  if (scheduleCallBtn) {
    scheduleCallBtn.addEventListener('click', () => {
      showNotification('سيتم توجيهك لحجز مكالمة خاصة...', 'info');
      setTimeout(() => window.open('https://wa.me/message/EUGNIXH6NHRZL1', '_blank'), 1000);
    });
  }

  function sendChatMessage() {
    if (!chatInput) return;
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage('أنت', message, false);
    chatInput.value = '';

    setTimeout(() => {
      const responses = [
        'شكراً لسؤالك! سنجيب عليه في البث',
        'سؤال ممتاز! سنناقشه الآن',
        'تم استلام سؤالك، سنرد عليه قريباً',
        'سؤال مهم جداً، دعنا نوضح لك',
      ];
      addMessage('مستشار الجوابرة', responses[Math.floor(Math.random() * responses.length)], true);
    }, 2000 + Math.random() * 3000);
  }

  if (sendMessage) sendMessage.addEventListener('click', sendChatMessage);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }
}


/* =========================================================
   NAV DROPDOWN: Dashboard menu (single clean version)
========================================================= */
/** Dashboard dropdown logic */
function initDashboardDropdown() {
  const dropdown = document.querySelector('.nav-dashboard-dropdown');
  const btn = document.getElementById('dashboardBtn');
  const menu = document.getElementById('dashboardMenu');

  if (!dropdown || !btn || !menu) return;

  const closeDropdown = () => {
    dropdown.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
  };

  const openDropdown = () => {
    dropdown.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
  };

  const toggleDropdown = () => {
    dropdown.classList.contains('active') ? closeDropdown() : openDropdown();
  };

  // Click on Dashboard button
  btn.addEventListener('click', (e) => {
    const loggedIn = hasValidSupabaseSessionInStorage();
    if (!loggedIn) {
      e.preventDefault();
      window.location.href = 'auth/login.html';
      return;
    }

    e.preventDefault();
    toggleDropdown();
  });

  // Click inside menu items
  menu.addEventListener('click', (e) => {
    const link = e.target.closest('a.dropdown-item');
    if (!link) return;

    const requiresAuth = link.dataset.requiresAuth === '1';
    if (requiresAuth && !hasValidSupabaseSessionInStorage()) {
      e.preventDefault();
      window.location.href = 'auth/login.html';
      return;
    }

    // allow navigation normally
    closeDropdown();
  });

  // Click outside closes dropdown
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) closeDropdown();
  });

  // ESC closes dropdown
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });
}


/* =========================================================
   ANIMATIONS INIT (AOS + custom)
========================================================= */
/** Initialize animations after loading */
function initializeAnimations() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
  }

  initializeScrollAnimations();
  initializeParallax();

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    });
    statsObserver.observe(statsSection);
  }
}


/* =========================================================
   SERVICE WORKER (optional)
========================================================= */
function initServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => console.log('SW registered: ', registration))
      .catch((err) => console.log('SW registration failed: ', err));
  });
}


/* =========================================================
   STYLES INJECTION (focus + reduce motion + animation)
========================================================= */
/** Inject required small CSS helpers */
function injectHelperStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .animate-in { animation: fadeInUp 0.6s ease-out forwards; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .focused {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .notification-content {
      display:flex; align-items:center; gap:.5rem;
    }
    .notification-close {
      background:none; border:none; color:inherit;
      cursor:pointer; padding:.25rem; margin-left:auto;
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
  document.head.appendChild(style);
}


/* =========================================================
   MAIN INIT
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Core UI
  initProgressBar();
  initHeaderScroll();
  initMobileNavigation();
  initBackToTop();
  initContactModal();
  initInternalAnchorSmoothScroll(); // safe, only handles # links

  // Components
  initializeForms();
  initializeWhatsApp();
  initializeSearch();
  initializeAccessibility();
  initializeDarkMode();
  initializeCookieConsent();
  initializeLazyLoading();
  initializeFAQ();
  initializeLiveStream();

  // Dropdown
  initDashboardDropdown();

  // Search actions -> Program page
  const searchBtn = document.getElementById('searchBtn');
  const browseBtn = document.getElementById('browseBtn');

  const buildProgramUrl = (tab) => {
    const params = new URLSearchParams();
    params.set('tab', tab);

    if (tab === 'search') params.set('auto', '1');

    // Pass current filter values (if present) so Program page can prefill + auto-run search.
    const degree = document.getElementById('degreeFilter')?.value?.trim();
    const language = document.getElementById('languageFilter')?.value?.trim();
    const program = document.getElementById('programFilter')?.value?.trim();
    const city = document.getElementById('cityFilter')?.value?.trim();

    if (degree) params.set('degree', degree);
    if (language) params.set('language', language);
    if (program) params.set('program', program);
    if (city) params.set('city', city);

    return `/universities/?${params.toString()}`;
  };

  searchBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = buildProgramUrl('search');
  });

  browseBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = buildProgramUrl('browse');
  });
// Styles
  injectHelperStyles();

  // Analytics
  trackEvent('page_load', {
    page_title: document.title,
    page_location: window.location.href,
  });
});

// Loading screen (after DOM ready)
initLoadingScreen();

// Global error handler
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});

// Performance monitor
window.addEventListener('load', () => {
  if ('performance' in window && performance.timing) {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log('Page load time:', loadTime + 'ms');
    trackEvent('performance', { load_time: loadTime, page_url: window.location.href });
  }
});

// Service worker
initServiceWorker();
