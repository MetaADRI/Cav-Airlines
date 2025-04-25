// services.js
// JS for services page (header blur on scroll, prepared for future page-specific logic)

// Header blur on scroll (matches booking.js and home.js)
window.addEventListener('scroll', function () {
    const header = document.querySelector('.cav-header');
    if (header) {
        if (window.scrollY) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Fade-in-up animation for perks, discover, and banner sections
    const fadeSections = [
        document.querySelector('.services-perks-section'),
        document.querySelector('.services-discover-section'),
        document.querySelector('.offers-banner-section')
    ];
    fadeSections.forEach(section => {
        if (section) {
            section.classList.add('fade-in-up');
        }
    });
    const observer = new window.IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18 });
    fadeSections.forEach(section => {
        if (section) observer.observe(section);
    });

    // Discover section dropdown logic
    const discoverDropdown = document.getElementById('discover-dropdown');
    const internationalContent = document.getElementById('discover-international');
    const domesticContent = document.getElementById('discover-domestic');
    if (discoverDropdown && internationalContent && domesticContent) {
        discoverDropdown.addEventListener('change', function() {
            if (this.value === 'international') {
                internationalContent.style.display = '';
                domesticContent.style.display = 'none';
            } else {
                internationalContent.style.display = 'none';
                domesticContent.style.display = '';
            }
        });
    }
});
