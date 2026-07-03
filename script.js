const root = document.documentElement;
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const themeToggles = document.querySelectorAll('.theme-toggle');
const progress = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
updateThemeButtons();

function updateThemeButtons() {
  const isDark = root.getAttribute('data-theme') === 'dark';
  themeToggles.forEach((button) => {
    button.textContent = isDark ? '☀' : '☾';
    button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

themeToggles.forEach((button) => {
  button.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
    updateThemeButtons();
  });
});

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const roles = [
  'Responsible Generative AI',
  'Low-resource NLP',
  'Clinical Computer Vision',
  'Cultural Bias Evaluation',
  'Trustworthy Multimodal AI'
];
let roleIndex = 0;
const roleEl = document.querySelector('#rotating-role');
if (roleEl) {
  setInterval(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    roleEl.style.opacity = '0';
    setTimeout(() => {
      roleEl.textContent = roles[roleIndex];
      roleEl.style.opacity = '1';
    }, 220);
  }, 2200);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const pageSections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
pageSections.forEach((section) => activeObserver.observe(section));

function updateScrollUi() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progress) progress.style.width = `${percentage}%`;
  if (backToTop) backToTop.classList.toggle('visible', scrollTop > 700);
}
window.addEventListener('scroll', updateScrollUi);
updateScrollUi();

if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    projectCards.forEach((card) => {
      const categories = card.dataset.category || '';
      card.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
    });
  });
});

document.querySelectorAll('.details-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = button.nextElementSibling;
    const isOpen = panel.classList.toggle('open');
    button.textContent = isOpen ? 'Hide contribution' : 'Show contribution';
  });
});

const copyEmail = document.querySelector('#copy-email');
const copyStatus = document.querySelector('#copy-status');
if (copyEmail && copyStatus) {
  copyEmail.addEventListener('click', async () => {
    const email = copyEmail.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = 'Email copied to clipboard.';
    } catch (error) {
      copyStatus.textContent = email;
    }
  });
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    const isDecimal = !Number.isInteger(target);
    let current = 0;
    const steps = 40;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = isDecimal ? target.toFixed(2) : target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = isDecimal ? current.toFixed(2) : Math.round(current).toLocaleString();
      }
    }, 25);
    countObserver.unobserve(element);
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach((element) => countObserver.observe(element));


// Copy DOI/citation buttons in the publications section.
document.querySelectorAll('.copy-link').forEach((button) => {
  button.addEventListener('click', async () => {
    const text = button.dataset.copy || '';
    const parent = button.closest('.timeline-item') || button.parentElement;
    const feedback = parent ? parent.querySelector('.copy-feedback') : null;
    try {
      await navigator.clipboard.writeText(text);
      if (feedback) feedback.textContent = button.textContent.includes('citation') ? 'Citation copied.' : 'DOI copied.';
    } catch (error) {
      if (feedback) feedback.textContent = text;
    }
    if (feedback) {
      setTimeout(() => { feedback.textContent = ''; }, 2200);
    }
  });
});


// Certificate filter buttons and copy-path actions.
const certFilterButtons = document.querySelectorAll('.cert-filter-button');
const certificateCards = document.querySelectorAll('.certificate-card');
certFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.certFilter;
    certFilterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    certificateCards.forEach((card) => {
      const category = card.dataset.certCategory || '';
      card.classList.toggle('hidden', filter !== 'all' && !category.includes(filter));
    });
  });
});

document.querySelectorAll('.cert-copy').forEach((button) => {
  button.addEventListener('click', async () => {
    const text = button.dataset.copy || '';
    const oldText = button.textContent;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Path copied';
    } catch (error) {
      button.textContent = text;
    }
    setTimeout(() => { button.textContent = oldText; }, 1900);
  });
});
