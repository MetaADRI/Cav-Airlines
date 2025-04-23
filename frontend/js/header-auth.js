// header-auth.js - Handles login/user icon dropdown in header

document.addEventListener('DOMContentLoaded', function() {
    const slot = document.getElementById('header-auth-slot');
    if (!slot) return;
    // Check login state
    const isLoggedIn = sessionStorage.getItem('cavair_isLoggedIn') === '1';
    if (!isLoggedIn) {
        // Show Login button
        slot.innerHTML = '<a href="login.html" class="header-login-btn">Login</a>';
        return;
    }
    // Show user icon with dropdown
    slot.innerHTML = `
      <div class="header-user-dropdown">
        <span class="header-user-icon" tabindex="0">
          <img src="assets/icons/user-icon.svg" alt="User">
        </span>
        <div class="header-user-menu">
          <a href="user_dashboard.html">Dashboard</a>
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
    icon.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            menu.classList.toggle('show-menu');
        }
    });
    // Hide menu when clicking elsewhere
    document.addEventListener('click', function() {
        menu.classList.remove('show-menu');
    });
    // Logout logic
    const logoutBtn = slot.querySelector('#header-logout-btn');
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('cavair_isLoggedIn');
        window.location.href = 'home.html';
    });
});
