document.addEventListener('DOMContentLoaded', () => {
  const fadeImages = document.querySelectorAll('.fade-in-from-below');

  function fadeIn(element) {
    element.classList.add('faded-in');
  }

  function checkFade() {
    fadeImages.forEach(image => {
      const elementTop = image.getBoundingClientRect().top;
      const elementBottom = image.getBoundingClientRect().bottom;

      if (elementTop < window.innerHeight * 0.8 && elementBottom > 0) {
        fadeIn(image);
      }
    });
  }

  // Initial check on load
  checkFade();

  // Check on scroll
  window.addEventListener('scroll', checkFade);
});
