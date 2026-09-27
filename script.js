const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Відкрити меню' : 'Закрити меню');
  nav.classList.toggle('is-open', !isOpen);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Відкрити меню');
    nav.classList.remove('is-open');
  });
});

const introTabs = [...document.querySelectorAll('.intro-tab')];
const introSlides = [...document.querySelectorAll('.intro-slide')];
const introCarousel = document.querySelector('.intro-carousel');
const introNext = document.querySelector('.intro-next');

if (introTabs.length && introSlides.length && introCarousel && introNext) {
  let activeSlide = 0;
  let touchStartX = null;

  const showSlide = (index) => {
    activeSlide = (index + introSlides.length) % introSlides.length;
    introTabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === activeSlide;
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      introSlides[tabIndex].hidden = !isActive;
    });
  };

  introTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showSlide(index));
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const step = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (index + step + introTabs.length) % introTabs.length;
        showSlide(nextIndex);
        introTabs[nextIndex].focus();
      }
    });
  });

  introNext.addEventListener('click', () => showSlide(activeSlide + 1));
  introCarousel.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  introCarousel.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) showSlide(activeSlide + (distance < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });
}
