 document.addEventListener('DOMContentLoaded', function() {
            // ===== Mobile Menu Functionality =====
            const hamburger = document.querySelector('.hamburger-menu');
            const mobileMenu = document.getElementById('mobile-menu');
            
            if (hamburger) {
                hamburger.addEventListener('click', function() {
                    this.classList.toggle('active');
                    mobileMenu.classList.toggle('active');
                    document.body.classList.toggle('no-scroll');
                    
                    // Animate hamburger to X
                    const spans = this.querySelectorAll('span');
                    if (this.classList.contains('active')) {
                        spans[0].style.transform = 'translateY(9px) rotate(45deg)';
                        spans[1].style.opacity = '0';
                        spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
                    } else {
                        spans[0].style.transform = '';
                        spans[1].style.opacity = '';
                        spans[2].style.transform = '';
                    }
                });
            }
            
            // Close mobile menu when clicking on a link
            const mobileLinks = document.querySelectorAll('.mobile-nav a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                    hamburger.classList.remove('active');
                    const spans = hamburger.querySelectorAll('span');
                    spans[0].style.transform = '';
                    spans[1].style.opacity = '';
                    spans[2].style.transform = '';
                });
            });
            
            // ===== Header Scroll Behavior =====
            const header = document.getElementById('cav-header');
            let lastScroll = 0;
            const scrollThreshold = 5;
            
            window.addEventListener('scroll', function() {
                const currentScroll = window.scrollY;
                
                if (Math.abs(currentScroll - lastScroll) < scrollThreshold) return;
                
                if (currentScroll <= 0) {
                    // At top of page
                    header.classList.remove('scrolled');
                    header.style.transform = 'translateY(0)';
                } else if (currentScroll > lastScroll && currentScroll > 100) {
                    // Scrolling down past threshold
                    header.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    header.classList.add('scrolled');
                    header.style.transform = 'translateY(0)';
                }
                
                lastScroll = currentScroll;
            });
            
            // Initialize header state
            if (window.scrollY > 0) {
                header.classList.add('scrolled');
            }
            
            // ===== Discover Section Dropdown =====
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
            
            // ===== Scroll Animations =====
            const fadeSections = document.querySelectorAll('.fade-in-up');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            
            fadeSections.forEach(section => {
                observer.observe(section);
            });
            
            // ===== Auth Slot Management =====
            function handleAuthContent() {
                const desktopAuth = document.getElementById('header-auth-slot');
                const mobileAuth = document.getElementById('mobile-auth-slot');
                
                // Sample auth state - in a real app, this would come from your auth system
                const isLoggedIn = false; // Change to true to see logged in state
                const user = {
                    name: 'John Doe',
                    avatar: 'assets/images/user-avatar.jpg'
                };
                
                const authHTML = isLoggedIn ? `
                    <div class="header-user-dropdown">
                        <div class="header-user-icon" id="user-icon">
                            <img src="${user.avatar}" alt="${user.name}">
                        </div>
                        <div class="header-user-menu" id="user-menu">
                            <a href="#">My Profile</a>
                            <a href="#">My Bookings</a>
                            <a href="#">Settings</a>
                            <a href="#" id="header-logout-btn">Log Out</a>
                        </div>
                    </div>
                ` : `
                    <a href="login.html" class="header-login-btn">Log In</a>
                `;
                
                if (window.innerWidth <= 900) {
                    // Mobile view - move to mobile menu
                    if (desktopAuth && mobileAuth) {
                        mobileAuth.innerHTML = authHTML;
                        desktopAuth.innerHTML = '';
                    }
                } else {
                    // Desktop view - move to header
                    if (desktopAuth && mobileAuth) {
                        desktopAuth.innerHTML = authHTML;
                        mobileAuth.innerHTML = '';
                    }
                }
                
                // Initialize user dropdown if logged in
                if (isLoggedIn) {
                    const userIcon = document.getElementById('user-icon');
                    const userMenu = document.getElementById('user-menu');
                    
                    if (userIcon && userMenu) {
                        userIcon.addEventListener('click', function(e) {
                            e.stopPropagation();
                            userMenu.classList.toggle('show-menu');
                        });
                        
                        // Close when clicking outside
                        document.addEventListener('click', function() {
                            userMenu.classList.remove('show-menu');
                        });
                    }
                }
            }
            
            // Initialize and handle resize
            handleAuthContent();
            window.addEventListener('resize', handleAuthContent);
            
            // ===== Video Autoplay =====
            const heroVideo = document.getElementById('services-hero-video');
            if (heroVideo) {
                // Ensure video plays when it's in view
                const videoObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            heroVideo.play().catch(e => console.log('Video autoplay prevented:', e));
                        } else {
                            heroVideo.pause();
                        }
                    });
                }, { threshold: 0.5 });
                
                videoObserver.observe(heroVideo);
            }
            
            // ===== Translate Functionality =====
            const translateTrigger = document.getElementById('translate-trigger');
            const languageSelect = document.createElement('select');
            
            if (translateTrigger) {
                languageSelect.id = 'language-select';
                languageSelect.className = 'header-language-select language-dropdown';
                languageSelect.setAttribute('aria-label', 'Translate site');
                languageSelect.style.cssText = 'display:none; min-width:140px; position:absolute; left:50%; transform:translateX(-50%); top:36px; z-index:3000;';
                
                const languages = [
                    { value: 'en', text: 'English' },
                    { value: 'fr', text: 'Français' },
                    { value: 'pt', text: 'Português' },
                    { value: 'es', text: 'Español' },
                    { value: 'ar', text: 'العربية' },
                    { value: 'de', text: 'Deutsch' },
                    { value: 'it', text: 'Italiano' }
                ];
                
                languages.forEach(lang => {
                    const option = document.createElement('option');
                    option.value = lang.value;
                    option.textContent = lang.text;
                    languageSelect.appendChild(option);
                });
                
                translateTrigger.parentNode.appendChild(languageSelect);
                
                translateTrigger.addEventListener('click', function(e) {
                    e.stopPropagation();
                    languageSelect.style.display = languageSelect.style.display === 'none' ? 'block' : 'none';
                });
                
                languageSelect.addEventListener('change', function() {
                    console.log('Language changed to:', this.value);
                    // In a real app, you would implement translation logic here
                    languageSelect.style.display = 'none';
                });
                
                // Close when clicking outside
                document.addEventListener('click', function() {
                    languageSelect.style.display = 'none';
                });
            }
        });