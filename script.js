/* =============================================================
   PORTFOLIO — MAIN JAVASCRIPT
   Vanilla JS only. Handles: loading screen, scroll progress,
   custom cursor, particles background, navbar scroll state,
   mobile menu, dark mode toggle, typing effect, counters,
   scroll reveal, skill bars, circular skills, project filters,
   ripple buttons, back-to-top, FAB, and contact form validation.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. LOADING SCREEN
     Hides the loader once the window has fully loaded.
  --------------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
  // Safety fallback in case 'load' fires slowly on slow connections
  setTimeout(() => loader.classList.add('hidden'), 3000);

  /* ---------------------------------------------------------
     2. SCROLL PROGRESS BAR
     Fills as the user scrolls down the page.
  --------------------------------------------------------- */
  const scrollProgress = document.getElementById('scroll-progress');

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', updateScrollProgress);
  updateScrollProgress();

  /* ---------------------------------------------------------
     3. CUSTOM CURSOR + GLOW
     Follows the mouse. Disabled automatically on touch
     devices via the CSS (hover:none) media query.
  --------------------------------------------------------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorGlow = document.getElementById('cursor-glow');

  window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });

  // Slightly enlarge the dot when hovering interactive elements
  document.querySelectorAll('a, button, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.style.transform = 'translate(-50%, -50%) scale(2.2)');
    el.addEventListener('mouseleave', () => cursorDot.style.transform = 'translate(-50%, -50%) scale(1)');
  });

  /* ---------------------------------------------------------
     4. PARTICLES BACKGROUND (hero canvas)
     A lightweight, dependency-free particle field with
     subtle connecting lines, drawn on a canvas.
  --------------------------------------------------------- */
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const heroSection = document.querySelector('.hero-section');

  const resizeCanvas = () => {
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  };

  const createParticles = () => {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.6,
      });
    }
  };

  const drawParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.fill();
    });

    // Connect nearby particles with faint lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${1 - dist / 110})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  };

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  /* ---------------------------------------------------------
     5. NAVBAR SCROLL STATE + MOBILE MENU
  --------------------------------------------------------- */
  const navbar = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  const navToggler = document.getElementById('navToggler');
  const navbarContent = document.getElementById('navbarContent');

  navToggler.addEventListener('click', () => {
    const isOpen = navbarContent.classList.toggle('show');
    navToggler.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu after clicking a link, and set active state
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbarContent.classList.remove('show');
      navToggler.setAttribute('aria-expanded', 'false');
    });
  });

  const sections = document.querySelectorAll('section[id], header[id]');
  const highlightActiveLink = () => {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) currentId = section.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', highlightActiveLink);
  highlightActiveLink();

  /* ---------------------------------------------------------
     6. DARK / LIGHT MODE TOGGLE
     Persists the choice for the current session.
  --------------------------------------------------------- */
  const darkModeToggle = document.getElementById('darkModeToggle');

  const applyStoredTheme = () => {
    const saved = sessionStorage.getItem('portfolio-theme');
    if (saved === 'light') document.body.classList.add('light-mode');
  };
  applyStoredTheme();

  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const mode = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    sessionStorage.setItem('portfolio-theme', mode);
  });

  /* ---------------------------------------------------------
     7. HERO TYPING EFFECT
     Cycles through a list of professional titles.
  --------------------------------------------------------- */
  const typedTextEl = document.getElementById('typed-text');
  const rolesToType = [
    'Full Stack Developer',
    'UI/UX Enthusiast',
    'Cloud-Native Engineer',
    'Problem Solver',
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeLoop = () => {
    const currentRole = rolesToType[roleIndex];

    if (!isDeleting) {
      typedTextEl.textContent = currentRole.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1400); // pause before deleting
        return;
      }
    } else {
      typedTextEl.textContent = currentRole.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % rolesToType.length;
      }
    }

    setTimeout(typeLoop, isDeleting ? 45 : 90);
  };

  typeLoop();

  /* ---------------------------------------------------------
     8. SCROLL REVEAL (IntersectionObserver)
     Fades/slides elements up as they enter the viewport,
     and triggers dependent animations (counters, bars).
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------
     9. ANIMATED STATISTIC COUNTERS
     Counts up from 0 to the target value once visible.
  --------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(counter => counterObserver.observe(counter));

  /* ---------------------------------------------------------
     10. LINEAR SKILL PROGRESS BARS
  --------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-progress span');

  const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = `${entry.target.dataset.width}%`;
        skillBarObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  skillBars.forEach(bar => skillBarObserver.observe(bar));

  /* ---------------------------------------------------------
     11. CIRCULAR SKILL CARDS
     Animates the SVG stroke-dashoffset based on percentage.
  --------------------------------------------------------- */
  const circleWrappers = document.querySelectorAll('.circle-progress');
  const CIRCUMFERENCE = 2 * Math.PI * 52; // r=52 from the SVG markup

  const circleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const wrapper = entry.target;
        const percent = parseInt(wrapper.dataset.percent, 10);
        const fillCircle = wrapper.querySelector('.circle-fill');
        const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
        fillCircle.style.strokeDasharray = CIRCUMFERENCE;
        fillCircle.style.strokeDashoffset = offset;
        circleObserver.unobserve(wrapper);
      }
    });
  }, { threshold: 0.4 });

  circleWrappers.forEach(wrapper => circleObserver.observe(wrapper));

  /* ---------------------------------------------------------
     12. PROJECT FILTERING
  --------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter;

      projectItems.forEach(item => {
        const matches = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('filtered-out', !matches);
      });
    });
  });

  /* ---------------------------------------------------------
     13. BUTTON RIPPLE EFFECT
  --------------------------------------------------------- */
  document.querySelectorAll('.ripple').forEach(button => {
    button.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
      circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
      circle.classList.add('ripple-circle');

      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });

  /* ---------------------------------------------------------
     14. BACK TO TOP BUTTON
  --------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     15. FLOATING ACTION BUTTON
  --------------------------------------------------------- */
  const fabMain = document.getElementById('fabMain');
  const fabOptions = document.getElementById('fabOptions');

  fabMain.addEventListener('click', () => {
    fabOptions.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!fabMain.contains(e.target) && !fabOptions.contains(e.target)) {
      fabOptions.classList.remove('open');
    }
  });

  /* ---------------------------------------------------------
     16. CONTACT FORM VALIDATION
     Client-side only — no backend wired up in this template.
  --------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const cfStatus = document.getElementById('cf-status');

  const cfFields = {
    name: { el: document.getElementById('cf-name'), error: document.getElementById('cf-name-error') },
    email: { el: document.getElementById('cf-email'), error: document.getElementById('cf-email-error') },
    subject: { el: document.getElementById('cf-subject'), error: document.getElementById('cf-subject-error') },
    message: { el: document.getElementById('cf-message'), error: document.getElementById('cf-message-error') },
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateCfField = (key) => {
    const { el, error } = cfFields[key];
    const value = el.value.trim();
    let message = '';

    if (!value) {
      message = 'This field is required.';
    } else if (key === 'email' && !isValidEmail(value)) {
      message = 'Enter a valid email address.';
    } else if (key === 'message' && value.length < 10) {
      message = 'Message should be at least 10 characters.';
    }

    error.textContent = message;
    el.classList.toggle('invalid', Boolean(message));
    return message === '';
  };

  Object.keys(cfFields).forEach(key => {
    cfFields[key].el.addEventListener('blur', () => validateCfField(key));
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const results = Object.keys(cfFields).map(validateCfField);
    const allValid = results.every(Boolean);

    if (!allValid) {
      cfStatus.textContent = 'Please fix the errors above before sending.';
      cfStatus.className = 'cf-status error';
      return;
    }

    const submitText = document.getElementById('cf-submit-text');
    submitText.textContent = 'Sending...';

    setTimeout(() => {
      cfStatus.textContent = "Message sent successfully! I'll get back to you soon.";
      cfStatus.className = 'cf-status success';
      submitText.textContent = 'Send Message';
      contactForm.reset();
    }, 900);
  });

  /* ---------------------------------------------------------
     17. FOOTER YEAR
  --------------------------------------------------------- */
  document.getElementById('footer-year').textContent = new Date().getFullYear();

});