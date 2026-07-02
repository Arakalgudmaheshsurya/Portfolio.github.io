// ============================================================
// Apple-style interactions: scroll reveals, counters, nav
// ============================================================

// --- Scroll-triggered reveal animations ---
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// --- Animated stat counters ---
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll('.stat-value[data-count]').forEach((el) => statObserver.observe(el));

// --- Mobile menu toggle ---
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// --- Scroll-linked effects: hero parallax, progress bar, back-to-top ---
const heroContent = document.querySelector('.hero-content');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener(
  'scroll',
  () => {
    const y = window.scrollY;

    if (!prefersReducedMotion && y < window.innerHeight) {
      heroContent.style.transform = `translateY(${y * 0.25}px)`;
      heroContent.style.opacity = String(Math.max(1 - y / (window.innerHeight * 0.7), 0));
    }

    const total = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = `${(y / total) * 100}%`;

    backToTop.classList.toggle('show', y > window.innerHeight * 0.8);
  },
  { passive: true }
);

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

// --- Active nav link highlighting ---
const navLinks = document.querySelectorAll('.globalnav-list a[href^="#"]');
const sectionsById = {};
navLinks.forEach((link) => {
  const section = document.querySelector(link.getAttribute('href'));
  if (section) sectionsById[section.id] = link;
});

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove('active'));
        const link = sectionsById[entry.target.id];
        if (link) link.classList.add('active');
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
Object.keys(sectionsById).forEach((id) => navObserver.observe(document.getElementById(id)));

// --- Cursor spotlight on cards ---
document.querySelectorAll('.bento-card, .project-card, .pub-card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

// --- 3D tilt on project cards ---
if (!prefersReducedMotion && matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateY(${px * 6}deg) rotateX(${py * -6}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}
