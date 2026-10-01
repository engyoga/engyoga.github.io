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

const storiesCarousel = document.querySelector('.stories-carousel');

if (storiesCarousel) {
  const storiesImage = storiesCarousel.querySelector('.stories-image');
  const storiesPrevious = storiesCarousel.querySelector('.stories-prev');
  const storiesNext = storiesCarousel.querySelector('.stories-next');
  const storiesDots = [...storiesCarousel.querySelectorAll('.stories-dot')];
  const storiesCurrent = storiesCarousel.querySelector('.stories-current');
  const storiesFrame = storiesCarousel.querySelector('.stories-frame');
  const storyImages = ['images/1.png', 'images/2.png', 'images/3.png', 'images/4.png', 'images/5.png'];
  let activeStory = 0;
  let touchStartX = null;

  const showStory = (index) => {
    activeStory = (index + storyImages.length) % storyImages.length;
    storiesImage.src = storyImages[activeStory];
    storiesImage.alt = `Фото ${activeStory + 1} із ${storyImages.length}`;
    storiesCurrent.textContent = String(activeStory + 1).padStart(2, '0');
    storiesDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeStory;
      dot.classList.toggle('is-active', isActive);
      if (isActive) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  storiesPrevious.addEventListener('click', () => showStory(activeStory - 1));
  storiesNext.addEventListener('click', () => showStory(activeStory + 1));
  storiesDots.forEach((dot, index) => dot.addEventListener('click', () => showStory(index)));
  storiesCarousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      showStory(activeStory + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  storiesFrame.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  storiesFrame.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) showStory(activeStory + (distance < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });
}

document.querySelectorAll('.faq-item').forEach((item) => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (!question || !answer) return;

  question.addEventListener('click', () => {
    const isOpen = question.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-item').forEach((other) => {
      const otherQuestion = other.querySelector('.faq-question');
      const otherAnswer = other.querySelector('.faq-answer');
      if (!otherQuestion || !otherAnswer) return;
      otherQuestion.setAttribute('aria-expanded', 'false');
      otherAnswer.hidden = true;
      other.classList.remove('is-open');
    });
    if (!isOpen) {
      question.setAttribute('aria-expanded', 'true');
      answer.hidden = false;
      item.classList.add('is-open');
    }
  });
});
