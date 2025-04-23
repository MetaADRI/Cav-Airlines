/**
 * Register Page JavaScript
 * 
 * This script handles the floating label functionality for the registration form
 * and implements validation for the phone number field to accept only digits.
 * 
 * @author [David.L] Group 2 - COM322 Web Development Project
 * @version 1.0
 */

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // AJAX registration logic
    const form = document.getElementById('register-form');
    const messageDiv = document.getElementById('register-message');
    // Login link redirect logic
    const loginLink = document.querySelector('.login-link');
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirect to login page in the same directory
window.location.href = 'login.html';
        });
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Clear previous errors
            messageDiv.textContent = '';
            messageDiv.className = 'register-message';
            document.getElementById('full_name_error').textContent = '';
            document.getElementById('password_error').textContent = '';

            // Client-side validation
            let valid = true;
            const fullName = document.getElementById('full_name').value.trim();
            const password = document.getElementById('password').value;

            if (fullName.length < 3) {
                document.getElementById('full_name_error').textContent = 'Full name must be at least 3 characters.';
                valid = false;
            } else {
                document.getElementById('full_name_error').textContent = '';
            }

            // Password: at least 8 chars, upper, lower, number, special char
            const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
            if (!pwRegex.test(password)) {
                document.getElementById('password_error').textContent = 'Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.';
                valid = false;
            } else {
                document.getElementById('password_error').textContent = '';
            }

            if (!valid) return;

            const formData = new FormData(form);
            fetch('../backend/register.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messageDiv.textContent = data.message || 'Registration successful';
                    messageDiv.classList.add('success');
                    setTimeout(() => {
                        // Set sessionStorage to indicate user is logged in
sessionStorage.setItem('cavair_isLoggedIn', '1');
window.location.href = '/CAV-Zambia-Airlines/frontend/home.html';
                    }, 2000);
                } else {
                    // Try to match backend error to a field
                    if (data.message && data.message.toLowerCase().includes('name')) {
                        document.getElementById('full_name_error').textContent = data.message;
                    } else if (data.message && data.message.toLowerCase().includes('password')) {
                        document.getElementById('password_error').textContent = data.message;
                    } else {
                        messageDiv.textContent = data.message || 'Registration failed';
                        messageDiv.classList.add('error');
                    }
                }
            })
            .catch(() => {
                messageDiv.textContent = 'An error occurred. Please try again.';
                messageDiv.classList.add('error');
            });
        });
    }
    /**
     * FLOATING LABEL FUNCTIONALITY
     * This section handles the behavior of the floating labels that move up when
     * an input field is focused or contains text.
     */
    
    // Select all input fields in the form
    const inputs = document.querySelectorAll('input');
    
    // Process each input field
    inputs.forEach(input => {
        // Add a space as placeholder to make CSS selectors work
        // This is needed for the :not(:placeholder-shown) selector to function properly
        input.setAttribute('placeholder', ' ');
        
        // When an input field receives focus
        input.addEventListener('focus', function() {
            // Add the 'focused' class to the parent element (form-group)
            // This helps with styling the focused state
            this.parentElement.classList.add('focused');
        });
        
        // When an input field loses focus
        input.addEventListener('blur', function() {
            // If the field is empty, remove the 'focused' class
            // This allows the label to return to its original position
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Handle case where field already has a value (e.g., on page refresh or form error)
        if (input.value !== '') {
            // Keep the label in the 'focused' position above the input
            input.parentElement.classList.add('focused');
        }
    });
    
    /**
     * PHONE NUMBER VALIDATION
     * This section ensures that only numeric digits can be entered in the phone field.
     */
    
    // Get the phone input element
    const phoneInput = document.getElementById('phone');
    
    // Add an input event listener to filter out non-digit characters
    phoneInput.addEventListener('input', function(e) {
        // Replace any non-digit character with an empty string
        // This effectively removes non-numeric characters as they're typed
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});
