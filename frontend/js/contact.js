// 1. Header blur/black background on scroll
(function() {
    const header = document.getElementById('cav-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
})();

// 2. Search bar interactivity (hero and Find Us)
document.addEventListener('DOMContentLoaded', function() {
    // Hero search bar - filter categories
    const heroSearchInput = document.getElementById('contact-search-input');
    const categoryCards = document.querySelectorAll('.category-card');
    if (heroSearchInput && categoryCards.length) {
        heroSearchInput.addEventListener('input', function() {
            const query = heroSearchInput.value.trim().toLowerCase();
            let found = false;
            categoryCards.forEach(card => {
                const title = card.querySelector('.category-card-title').textContent.toLowerCase();
                const desc = card.querySelector('.category-card-desc').textContent.toLowerCase();
                if (title.includes(query) || desc.includes(query)) {
                    card.style.display = '';
                    found = true;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Find Us search bar - filter locations
    const findUsInput = document.getElementById('find-us-location-input');
    const findUsNoResults = document.getElementById('find-us-no-results');
    const mapFrame = document.getElementById('google-map-frame');
    if (findUsInput && findUsNoResults && mapFrame) {
        findUsInput.addEventListener('input', function() {
            const val = findUsInput.value.trim().toLowerCase();
            if (!val || 'lusaka'.includes(val)) {
                mapFrame.style.display = '';
                findUsNoResults.textContent = '';
            } else {
                mapFrame.style.display = 'none';
                findUsNoResults.textContent = 'No results found.';
            }
        });
    }

    // 3. Click-to-copy for phone/email in Get in Touch
    const infoCards = document.querySelectorAll('.get-in-touch-cards .info-card');
    infoCards.forEach(card => {
        const title = card.querySelector('.info-card-title');
        const desc = card.querySelector('.info-card-desc');
        if (title && desc) {
            if (title.textContent.toLowerCase().includes('phone')) {
                desc.style.cursor = 'pointer';
                desc.title = 'Click to copy number';
                desc.addEventListener('click', function() {
                    // Copy all numbers (remove <br>)
                    const text = desc.innerText.replace(/\n/g, ', ');
                    navigator.clipboard.writeText(text).then(() => {
                        showTooltip(desc, 'Copied!');
                    });
                });
            }
            if (title.textContent.toLowerCase().includes('email')) {
                desc.style.cursor = 'pointer';
                desc.title = 'Click to copy email';
                desc.addEventListener('click', function() {
                    // Copy all emails (remove <br>)
                    const text = desc.innerText.replace(/\n/g, ', ');
                    navigator.clipboard.writeText(text).then(() => {
                        showTooltip(desc, 'Copied!');
                    });
                });
            }
        }
    });

    // Tooltip helper
    function showTooltip(el, msg) {
        let tooltip = document.createElement('span');
        tooltip.textContent = msg;
        tooltip.style.position = 'absolute';
        tooltip.style.background = '#d600ff';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '3px 10px';
        tooltip.style.borderRadius = '7px';
        tooltip.style.fontSize = '0.97rem';
        tooltip.style.zIndex = 10000;
        tooltip.style.top = (el.offsetTop - 32) + 'px';
        tooltip.style.left = (el.offsetLeft + el.offsetWidth/2 - 35) + 'px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.transition = 'opacity 0.18s';
        tooltip.style.opacity = 1;
        tooltip.className = 'copy-tooltip';
        el.parentElement.appendChild(tooltip);
        setTimeout(() => { tooltip.style.opacity = 0; }, 900);
        setTimeout(() => { if(tooltip.parentElement) tooltip.parentElement.removeChild(tooltip); }, 1300);
    }
});
