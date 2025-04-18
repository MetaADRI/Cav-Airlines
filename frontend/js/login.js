/**
 * Login Page JavaScript
 * 
 * This script handles the floating label functionality for the login form.
 * It ensures that labels move up and stay up when fields are focused or filled.
 *  @author [David L.] Group 2 - COM322 Web Development Project
 *  @version 1.0
 */

// Debug: Confirm that the JS file is loaded
console.log('login.js loaded!');

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Get references to the login form and message div
    const form = document.getElementById('login-form');
    const messageDiv = document.getElementById('login-message');

    // Only proceed if both the form and message div exist
    if (form && messageDiv) {
        // Intercept the form submission to handle via AJAX
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission (page reload)
            messageDiv.textContent = '';
            messageDiv.className = 'login-message'; // Reset message styling

            // Collect form data
            const formData = new FormData(form);

            // Send login credentials to the backend using fetch (AJAX)
            fetch('../backend/login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json()) // Parse JSON response
            .then(data => {
                if (data.success) {
                    // On successful login, redirect to user dashboard (HTML)
                    // Redirect to the dashboard in the frontend directory
window.location.href = '/CAV-Zambia-Airlines/frontend/user_dashboard.html';
                } else {
                    // On failed login, show error message in red below the button
                    messageDiv.textContent = data.message || 'Invalid email or password';
                    messageDiv.classList.add('error');
                }
            })
            .catch(() => {
                // Handle network or server errors
                messageDiv.textContent = 'An error occurred. Please try again.';
                messageDiv.classList.add('error');
            });
        });
    }

    // Floating label functionality for all input fields
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        // Add a space as placeholder to enable :not(:placeholder-shown) CSS selector
        input.setAttribute('placeholder', ' ');
        // When input is focused, add 'focused' class to parent for label animation
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });
});

