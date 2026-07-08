// header-auth.js - Handles login/user icon dropdown in header

document.addEventListener('DOMContentLoaded', function() {
    const slot = document.getElementById('header-auth-slot');
    if (!slot) return;
    
    // Check login state via /api/auth/status
    fetch('/api/auth/status')
        .then(res => res.json())
        .then(data => {
            if (data.logged_in) {
                const user = data.user;
                const profilePic = user.profile_pic ? user.profile_pic : 'assets/icons/user-icon.svg';
                const isExternalPic = user.profile_pic ? true : false;
                
                // Show user icon with dropdown
                slot.innerHTML = `
                  <div class="header-user-dropdown">
                    <span class="header-user-icon" tabindex="0">
                      <img src="${profilePic}" alt="User">
                    </span>
                    <div class="header-user-menu">
                      <a href="user_dashboard.html" id="header-dashboard-btn">Dashboard</a>
                      <a href="#" id="header-logout-btn">Logout</a>
                    </div>
                  </div>
                `;
                
                const icon = slot.querySelector('.header-user-icon');
                const menu = slot.querySelector('.header-user-menu');
                
                icon.addEventListener('click', function(e) {
                    e.stopPropagation();
                    menu.classList.toggle('show-menu');
                });
                
                // Hide menu when clicking elsewhere
                document.addEventListener('click', function() {
                    menu.classList.remove('show-menu');
                });
                
                // Logout logic
                const logoutBtn = slot.querySelector('#header-logout-btn');
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    fetch('/api/auth/logout')
                        .then(() => {
                            sessionStorage.clear();
                            localStorage.clear();
                            window.location.href = 'home.html';
                        });
                });
            } else {
                // Show Login button
                slot.innerHTML = '<a href="login.html" class="header-login-btn">Login</a>';
            }
        })
        .catch(err => {
            console.error('Auth check failed:', err);
            slot.innerHTML = '<a href="login.html" class="header-login-btn">Login</a>';
        });
});
