/* ============================================
   BEHRUZ.DEV — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initMobileMenu();
  initLangSwitcher();
  initTypingEffect();
  initCounters();
  initScrollReveal();
  initBackToTop();
  initLiveClock();
  initMatrix();
  applyTranslations();
  loadProfileImage();
  loadSocialLinks();
});

/* Custom Cursor */
function initCursor() {
  if (window.innerWidth < 768) return;
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  const follower = document.createElement('div');
  follower.className = 'cursor-follower';
  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .btn, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
      cursor.style.background = 'rgba(0, 255, 136, 0.15)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.background = 'transparent';
    });
  });
}

/* Navbar scroll */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* Mobile menu */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

/* Language switcher */
function initLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      Storage.setLang(lang);
      applyTranslations();
      // Re-run typing if present
      const roleEl = document.querySelector('.role');
      if (roleEl && window.typingInterval) {
        clearInterval(window.typingInterval);
        initTypingEffect();
      }
      // Refresh dynamic content
      if (typeof renderProjects === 'function') renderProjects();
      if (typeof renderSkills === 'function') renderSkills();
      if (typeof renderAbout === 'function') renderAbout();
    });
  });
}

/* Typing effect */
function initTypingEffect() {
  const el = document.querySelector('.role');
  if (!el) return;

  const lang = Storage.getLang();
  const phrases = Translations[lang]?.hero_typing || Translations.en.hero_typing;
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      el.innerHTML = current.substring(0, charIndex - 1) + '<span class="typing-cursor"></span>';
      charIndex--;
    } else {
      el.innerHTML = current.substring(0, charIndex + 1) + '<span class="typing-cursor"></span>';
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }

    window.typingTimeout = setTimeout(type, speed);
  }

  if (window.typingTimeout) clearTimeout(window.typingTimeout);
  type();
}

/* Animated counters */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.dataset.target;
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el, target) {
  const isPlus = target.includes('+');
  const num = parseInt(target);
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * num) + (isPlus ? '+' : '');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* Scroll reveal */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* Back to top */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* Live clock */
function initLiveClock() {
  const el = document.querySelector('.live-clock');
  if (!el) return;

  function update() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
  }
  update();
  setInterval(update, 1000);
}

/* Matrix background */
function initMatrix() {
  const canvas = document.querySelector('.matrix-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, columns, drops;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / 18);
    drops = Array(columns).fill(1);
  }

  resize();
  window.addEventListener('resize', resize);

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

  function draw() {
    ctx.fillStyle = 'rgba(5, 8, 7, 0.05)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#00FF88';
    ctx.font = '14px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * 18, drops[i] * 18);
      if (drops[i] * 18 > height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  setInterval(draw, 50);
}

/* Profile image from storage */
function loadProfileImage() {
  const profile = Storage.getProfile();
  const frames = document.querySelectorAll('.profile-frame');
  frames.forEach(frame => {
    if (profile.image) {
      frame.innerHTML = `<img src="${profile.image}" alt="${profile.name}" loading="lazy">`;
    } else {
      frame.innerHTML = `
        <div class="profile-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Upload Photo</span>
        </div>`;
    }
  });
}

/* Social links */
function loadSocialLinks() {
  const profile = Storage.getProfile();
  const container = document.querySelector('.social-links');
  if (!container) return;

  const links = [
    { url: profile.telegram, icon: '✈', label: 'Telegram' },
    { url: profile.github, icon: '⌘', label: 'GitHub' },
    { url: profile.instagram, icon: '◎', label: 'Instagram' },
    { url: `mailto:${profile.email}`, icon: '✉', label: 'Email' }
  ];

  container.innerHTML = links
    .filter(l => l.url)
    .map(l => `<a href="${l.url}" target="_blank" rel="noopener" title="${l.label}" aria-label="${l.label}">${l.icon}</a>`)
    .join('');
}

/* CV download */
function downloadCV() {
  const profile = Storage.getProfile();
  if (profile.cv) {
    const a = document.createElement('a');
    a.href = profile.cv;
    a.download = 'Behruz_Norsafarov_CV.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    const lang = Storage.getLang();
    const msg = {
      uz: "CV hali yuklanmagan. Admin panel orqali PDF yuklang: /admin/profile.html",
      en: "CV not uploaded yet. Upload a PDF via Admin Panel: /admin/profile.html",
      ru: "CV ещё не загружено. Загрузите PDF через админ-панель: /admin/profile.html"
    };
    alert(msg[lang] || msg.en);
  }
}