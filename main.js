document.addEventListener('DOMContentLoaded', () => {
  
  // --- Sticky Header on Scroll ---
  const header = document.querySelector('.site-header');
  if (header) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 50) {
              header.classList.add('scrolled');
          } else {
              header.classList.remove('scrolled');
          }
      });
  }

  // --- Mobile Hamburger Menu ---
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !nav.contains(e.target)) {
             nav.classList.remove('open');
             toggle.setAttribute('aria-expanded', 'false');
        }
    });

    const links = nav.querySelectorAll('.nav-list a');
    links.forEach(link => link.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
            nav.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    }));
  }

  // --- Theme Toggle (light/dark) ---
  const themeToggle = document.querySelector('.theme-toggle');
  const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('zhiling-theme', theme);
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });

    const savedTheme = localStorage.getItem('zhiling-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (systemPrefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
  }

  // --- General Fade-in on Scroll ---
  const faders = document.querySelectorAll('.fade-in');
  const fadeInObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  faders.forEach(el => fadeInObserver.observe(el));

  // --- Animated Counters ---
  const statsContainer = document.querySelector('.stats-counter');
  if (statsContainer) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.stat-number');
          counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let current = 0;
            const increment = target / 100;

            const updateCounter = () => {
              if (current < target) {
                current += increment;
                if (target % 1 !== 0) {
                    counter.innerText = current.toFixed(1);
                } else {
                    counter.innerText = Math.ceil(current);
                }
                requestAnimationFrame(updateCounter);
              } else {
                counter.innerText = target;
              }
            };
            updateCounter();
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(statsContainer);
  }

  // --- Swiper.js Initializations ---
  if (typeof Swiper !== 'undefined') {
    const swiperConfig = {
      loop: true,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    };

    new Swiper('.testimonial-slider', {
      ...swiperConfig,
      autoplay: { delay: 5000, disableOnInteraction: false },
      slidesPerView: 1,
    });

    new Swiper('.partners-slider', {
      ...swiperConfig,
      autoplay: { delay: 3000, disableOnInteraction: false },
      slidesPerView: 1,
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }
    });

    new Swiper('.pricelists-slider', {
      ...swiperConfig,
      autoplay: { delay: 4000, disableOnInteraction: false },
      slidesPerView: 1,
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }
    });
  }

  // --- Floating Action Buttons ---
  const fabTop = document.getElementById('fabTop');
  if (fabTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        fabTop.classList.add('visible');
      } else {
        fabTop.classList.remove('visible');
      }
    });
    fabTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // --- One-Time Contact Form Logic with Redirect ---
  const contactForm = document.getElementById('contactForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');

  if (contactForm) {
    if (localStorage.getItem('contactFormSubmitted') === 'true') {
      contactForm.style.display = 'none';
      if (formSuccessMessage) formSuccessMessage.style.display = 'block';
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = contactForm.querySelector('input[name="name"]');
      const emailInput = contactForm.querySelector('input[name="email"]');

      if (nameInput.value.trim() !== '' && emailInput.value.trim() !== '') {
        contactForm.style.display = 'none';
        if (formSuccessMessage) formSuccessMessage.style.display = 'block';
        localStorage.setItem('contactFormSubmitted', 'true');
        window.location.href = 'pricelists.html';
      } else {
        alert('Please fill in your name and email to proceed.');
      }
    });
  }

  // --- Set current year in footer ---
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});