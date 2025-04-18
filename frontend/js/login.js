/**
 * Login Page JavaScript
 * 
 * This script handles the floating label functionality for the login form.
 * It ensures that labels move up and stay up when fields are focused or filled.
 *  @author [David L.] Group 2 - COM322 Web Development Project
 *  @version 1.0
 */

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Select all input fields in the form
    const inputs = document.querySelectorAll('input');
    
    // Process each input field
    inputs.forEach(input => {
        // Add a space as placeholder to make CSS selectors work
        // This is needed for the :not(:placeholder-shown) selector
        input.setAttribute('placeholder', ' ');
        
        // When an input field receives focus
        input.addEventListener('focus', function() {
            // Add the 'focused' class to the parent element (form-group)
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
            // Keep the label in the 'focused' position
            input.parentElement.classList.add('focused');
        }
    });
});
