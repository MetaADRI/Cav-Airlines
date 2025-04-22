/**
 * Home Page JavaScript
 * 
 * This script handles the functionality for the homepage.
 * 
 * @author [David.L] Group 2 - COM322 Web Development Project
 * @version 1.0
 */

// Parallax background gradient movement
window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    // Move slower than scroll for subtle effect
    const posY = Math.round(scrollY * 0.18);
    document.documentElement.style.backgroundPosition = `0px ${posY}px`;
    document.body.style.backgroundPosition = `0px ${posY}px`;
});

document.addEventListener('DOMContentLoaded', function() {
    // Header blur on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.cav-header');
        if (header) {
            if (window.scrollY > 0) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
    // Set default value for Flight Status date field to today
    var dateInput = document.getElementById('flight-status-date');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
    const tabs = document.querySelectorAll('.booking-tab');
    const panels = document.querySelectorAll('.booking-tab-panel');
    const tabIcons = {
        book: {
            active: 'assets/icons/book_a_flight-icon(active).svg',
            inactive: 'assets/icons/book_a_flight-icon(inactive).svg'
        },
        manage: {
            active: 'assets/icons/manage-checkin-icon(active).svg',
            inactive: 'assets/icons/manage-checkin-icon(inactive).svg'
        },
        status: {
            active: 'assets/icons/flight_status-icon(active).svg',
            inactive: 'assets/icons/flight_status-icon(inactive).svg'
        }
    };

    function setTodayDate(inputId) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        document.getElementById(inputId).value = `${yyyy}-${mm}-${dd}`;
    }

    function toggleDateFields() {
        const tripType = document.getElementById('tripType').value;
        const returningField = document.querySelector('#date-fields-container .date-field:last-child');
        const arrowIcon = document.querySelector('#date-fields-container .departing-returning-arrow');
        const returningLabel = document.getElementById('returning-label');
        if (tripType === 'oneway') {
            returningField.style.display = 'none';
            arrowIcon.style.display = 'none';
            if (returningLabel) returningLabel.style.display = 'none';
        } else {
            returningField.style.display = 'flex';
            arrowIcon.style.display = 'block';
            if (returningLabel) returningLabel.style.display = 'inline-block';
        }
    }

    function handleFloatingLabel(inputId) {
        const input = document.getElementById(inputId);
        const label = input.nextElementSibling;
        function updateLabel() {
            if (document.activeElement === input || input.value) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        }
        input.addEventListener('focus', updateLabel);
        input.addEventListener('blur', updateLabel);
        input.addEventListener('input', updateLabel);
        updateLabel();
    }

    setTodayDate('departing-date');
    setTodayDate('returning-date');
    handleFloatingLabel('from');
    handleFloatingLabel('to');
    document.getElementById('tripType').addEventListener('change', toggleDateFields);
    toggleDateFields();

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active from all tabs
            tabs.forEach(t => {
                t.classList.remove('active');
                const icon = t.querySelector('.tab-icon');
                const key = t.getAttribute('data-tab');
                if(icon && tabIcons[key]) {
                    icon.src = tabIcons[key].inactive;
                }
            });
            // Hide all panels
            panels.forEach(panel => panel.style.display = 'none');
            // Activate this tab and show its panel
            this.classList.add('active');
            const tabKey = this.getAttribute('data-tab');
            const icon = this.querySelector('.tab-icon');
            if(icon && tabIcons[tabKey]) {
                icon.src = tabIcons[tabKey].active;
            }
            const activePanel = document.getElementById('tab-' + tabKey);
            if(activePanel) activePanel.style.display = 'block';
        });
    });
});

// Deals carousel functionality

// Parallax background gradient movement
window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    // Move slower than scroll for subtle effect
    const posY = Math.round(scrollY * 0.18);
    document.documentElement.style.backgroundPosition = `0px ${posY}px`;
    document.body.style.backgroundPosition = `0px ${posY}px`;
});

document.addEventListener('DOMContentLoaded', function() {
    const cards = Array.from(document.querySelectorAll('.deals-carousel-card'));
    const leftArrow = document.querySelector('.deals-carousel-arrow-left');
    const rightArrow = document.querySelector('.deals-carousel-arrow-right');
    const dots = Array.from(document.querySelectorAll('.deals-carousel-dot'));
    let current = 0; // Dubai is first card
    const total = cards.length;

    function updateCarousel() {
        cards.forEach((card, idx) => {
            card.classList.remove('active', 'left', 'right', 'far-left', 'far-right');
            // Calculate relative position
            let rel = (idx - current + total) % total;
            if (rel === 0) {
                card.classList.add('active');
            } else if (rel === 1 || rel === -(total-1)) {
                card.classList.add('right');
            } else if (rel === 2 || rel === -(total-2)) {
                card.classList.add('far-right');
            } else if (rel === total-1 || rel === -1) {
                card.classList.add('left');
            } else if (rel === total-2 || rel === -2) {
                card.classList.add('far-left');
            }

            // Banner logic
            const bannerLeft = card.querySelector('.deals-carousel-card-type-left');
            const bannerRight = card.querySelector('.deals-carousel-card-type-right');
            const cardInfo = card.querySelector('.deals-carousel-card-info');
            if (card.classList.contains('active')) {
                if (bannerLeft) bannerLeft.style.display = 'block';
                if (bannerRight) bannerRight.style.display = 'none';
                if (cardInfo) {
                    cardInfo.classList.add('info-left');
                    cardInfo.classList.remove('info-right');
                }
            } else if (card.classList.contains('left') || card.classList.contains('far-left')) {
                if (bannerLeft) bannerLeft.style.display = 'block';
                if (bannerRight) bannerRight.style.display = 'none';
                if (cardInfo) {
                    cardInfo.classList.add('info-left');
                    cardInfo.classList.remove('info-right');
                }
            } else {
                if (bannerLeft) bannerLeft.style.display = 'none';
                if (bannerRight) bannerRight.style.display = 'block';
                if (cardInfo) {
                    cardInfo.classList.add('info-right');
                    cardInfo.classList.remove('info-left');
                }
            }
        });
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === current);
        });
    }

    function goTo(idx) {
        current = (idx + total) % total;
        updateCarousel();
    }

    leftArrow.addEventListener('click', () => goTo(current - 1));
    rightArrow.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => goTo(idx));
    });

    // Swipe support for mobile
    let startX = null;
    document.querySelector('.deals-carousel-cards').addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });
    document.querySelector('.deals-carousel-cards').addEventListener('touchend', e => {
        if (startX !== null) {
            let dx = e.changedTouches[0].clientX - startX;
            if (dx > 40) goTo(current - 1);
            if (dx < -40) goTo(current + 1);
            startX = null;
        }
    });

    updateCarousel();
});