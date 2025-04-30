// Header blur effect on scroll for About Us page
window.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.cav-header');
    if (header) {
        function handleHeaderBlur() {
            if (window.scrollY > 8) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', handleHeaderBlur);
        handleHeaderBlur();
    }

    // Fade-in-up scroll reveal effect
    const fadeEls = document.querySelectorAll('.fade-in-up');
    function revealOnScroll() {
        const triggerBottom = window.innerHeight * 0.92;
        fadeEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < triggerBottom) {
                el.classList.add('visible');
            } else {
                el.classList.remove('visible');
            }
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('resize', revealOnScroll);
    // Initial check
    revealOnScroll();
});
