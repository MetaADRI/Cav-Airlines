// booking.js
// JS for booking page main form

// Header blur on scroll
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
    // --- Error and Success Message Logic ---
    const form = document.getElementById('booking-form');
    const fields = [
        { id: 'departure-date', required: true, error: 'Please select a departure date.' },
        { id: 'from-location', required: true, error: 'Please enter a valid departure location.' },
        { id: 'to-location', required: true, error: 'Please enter a valid destination.' },
        { id: 'full-name', required: true, pattern: /^[A-Za-z ]+$/, error: 'Please enter your full name (letters only).' },
        { id: 'id-passport-number', required: true, pattern: /^[0-9]+$/, error: 'Please enter a valid ID/Passport Number (digits only).' },
        { id: 'email-address', required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, error: 'Please enter a valid email address.' },
        { id: 'phone-number', required: true, pattern: /^[0-9]+$/, error: 'Please enter a valid phone number (digits only).' }
    ];

    var fileInput = document.getElementById('id-passport-upload');
    var fileErrorDiv = document.getElementById('upload-error');
    var uploadBtn = document.getElementById('upload-btn');

    // Success message container
    let successMsg = document.createElement('div');
    successMsg.id = 'booking-success-message';
    successMsg.style.display = 'none';
    successMsg.style.background = '#d4f7d4';
    successMsg.style.color = '#2d7a2d';
    successMsg.style.padding = '16px 20px';
    successMsg.style.marginBottom = '18px';
    successMsg.style.borderRadius = '12px';
    successMsg.style.fontWeight = '600';
    successMsg.style.textAlign = 'center';
    successMsg.textContent = 'Booking Successful!';
    form.parentNode.insertBefore(successMsg, form);

    // Helper for showing/hiding error
    function setError(fieldId, message) {
        const errDiv = document.getElementById(fieldId + '-error');
        if (errDiv) {
            errDiv.textContent = message || '';
        }
    }
    // Validate a single field
    function validateField(fieldObj) {
        const input = document.getElementById(fieldObj.id);
        if (!input) return true;
        let valid = true;
        if (fieldObj.required && !input.value.trim()) {
            setError(fieldObj.id, fieldObj.error);
            valid = false;
        } else if (fieldObj.pattern && input.value && !fieldObj.pattern.test(input.value)) {
            setError(fieldObj.id, fieldObj.error);
            valid = false;
        } else {
            setError(fieldObj.id, '');
        }
        return valid;
    }
    // Validate file upload
    function validateFile() {
        if (!fileInput) return true;
        const file = fileInput.files[0];
        if (!file) {
            if (fileErrorDiv) fileErrorDiv.textContent = 'Please upload your ID or Passport.';
            return false;
        }
        const allowed = ['image/jpeg','image/png','application/pdf'];
        if (!allowed.includes(file.type)) {
            if (fileErrorDiv) fileErrorDiv.textContent = 'Invalid file type. Accepted: JPG, PNG, PDF.';
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            if (fileErrorDiv) fileErrorDiv.textContent = 'File too large (max 5MB).';
            return false;
        }
        if (fileErrorDiv) fileErrorDiv.textContent = '';
        return true;
    }

    // Hide all error messages by default
    document.querySelectorAll('.error-message').forEach(el => el.classList.add('hidden-error'));

    // Form submit
    form.addEventListener('submit', function(e) {
        let valid = true;
        // On submit, show errors if any
        fields.forEach(f => {
            if (!validateField(f)) {
                valid = false;
                // Show the error message for this field
                const errDiv = document.getElementById(f.id + '-error');
                if (errDiv) errDiv.classList.remove('hidden-error');
            } else {
                // Hide error message if valid
                const errDiv = document.getElementById(f.id + '-error');
                if (errDiv) errDiv.classList.add('hidden-error');
            }
        });
        // File error
        if (!validateFile()) {
            valid = false;
            if (fileErrorDiv) if (fileErrorDiv) fileErrorDiv.classList.remove('hidden-error');
        } else {
            if (fileErrorDiv) if (fileErrorDiv) fileErrorDiv.classList.add('hidden-error');
        }
        if (!valid) {
            e.preventDefault();
            successMsg.style.display = 'none';
            return false;
        }
        // Submit booking via AJAX
        e.preventDefault();
        const formData = new FormData(form);
        fetch('backend/booking/booking.php', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                successMsg.style.display = 'block';
                form.reset();
                document.querySelectorAll('.has-content').forEach(el => el.classList.remove('has-content'));
                setTimeout(() => { successMsg.style.display = 'none'; }, 4000);
                fields.forEach(f => setError(f.id, ''));
                if (fileErrorDiv) fileErrorDiv.textContent = '';
                const uploadNote = document.querySelector('.upload-note');
                if (uploadNote) uploadNote.textContent = 'Accepted formats: JPG, PNG, PDF (Max 5MB)';
            } else {
                // Show backend error message
                alert(data.error || 'Booking failed. Please try again.');
            }
        })
        .catch(() => {
            alert('Booking failed. Please try again.');
        });
    });
    // --- End Error and Success Message Logic ---

    // --- Price Calculation Logic ---
    async function updateTotalPrice() {
        const origin = document.getElementById('from-location').value.trim();
        const destination = document.getElementById('to-location').value.trim();
        const departureDate = document.getElementById('departure-date').value;
        const classType = document.getElementById('class-type').value;
        const passengers = parseInt(document.getElementById('passengers').value, 10) || 1;
        const priceSpan = document.getElementById('booking-total-price');
        priceSpan.textContent = '';
        if (!origin || !destination || !departureDate) return;
        try {
            // 1. Fetch flight number
            const flightRes = await fetch('../backend/booking/get_flight_number.php?origin=' + encodeURIComponent(origin) + '&destination=' + encodeURIComponent(destination));
            const flightData = await flightRes.json();
            if (!flightData.success || !flightData.flight_number) {
                priceSpan.textContent = 'N/A';
                return;
            }
            // 2. Fetch price from backend using the flight number
            const priceRes = await fetch('../backend/booking/get_flight_price.php?flight_number=' + encodeURIComponent(flightData.flight_number));
            const priceData = await priceRes.json();
            if (!priceData.success || typeof priceData.price !== 'number') {
                priceSpan.textContent = 'N/A';
                return;
            }
            let basePrice = priceData.price;
            let multiplier = (classType === 'Business Class') ? 1.5 : 1.0;
            let total = basePrice * multiplier * passengers;
            priceSpan.textContent = 'ZMW ' + total.toLocaleString();
        } catch (e) {
            priceSpan.textContent = 'N/A';
        }
    }
    // Add event listeners to all relevant fields
    ['from-location','to-location','departure-date','class-type','passengers'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateTotalPrice);
    });
    // Initial price update
    updateTotalPrice();
    // Make clicking the date container trigger the date picker
    function setupDateContainerClick(containerId, inputId) {
        var container = document.getElementById(containerId);
        var input = document.getElementById(inputId);
        if (container && input) {
            container.addEventListener('click', function(e) {
                // Only trigger if not clicking the input itself (to avoid double event)
                if (e.target !== input) {
                    input.focus();
                    input.click();
                }
            });
        }
    }
    setupDateContainerClick('departure-date', 'departure-date');
    setupDateContainerClick('return-date-container', 'return-date');
    // Set default date for date fields to current date
    function getToday() {
        const d = new Date();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return d.getFullYear() + '-' + month + '-' + day;
    }
    var today = getToday();
    var dep = document.getElementById('departure-date');
    if (dep && !dep.value) dep.value = today;
    var ret = document.getElementById('return-date');
    if (ret && !ret.value) ret.value = today;

    // Ensure all floating label inputs have a placeholder for :placeholder-shown CSS
    const floatingInputs = document.querySelectorAll('.booking-form-main-container .floating-label-group input');
    floatingInputs.forEach(function(input) {
        if (!input.hasAttribute('placeholder')) {
            input.setAttribute('placeholder', ' ');
        }
        // On page load, float label if input has value
        if (input.value) {
            input.classList.add('has-content');
        }
        input.addEventListener('focus', function() {
            this.classList.add('has-content');
        });
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.classList.remove('has-content');
            }
        });
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-content');
            } else {
                this.classList.remove('has-content');
            }
        });
    });

    // Upload button triggers file input
    var uploadNote = document.querySelector('.upload-note');
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            fileInput.click();
        });
        fileInput.addEventListener('change', function() {
            if (fileInput.files && fileInput.files.length > 0) {
                const fileName = fileInput.files[0].name;
                if (uploadNote) {
                    uploadNote.textContent = 'Selected: ' + fileName;
                }
            } else {
                if (uploadNote) {
                    uploadNote.textContent = 'Accepted formats: JPG, PNG, PDF (Max 5MB)';
                }
            }
        });
    }
    // Trip type toggle logic
    const oneWayBtn = document.getElementById('one-way-btn');
    const returnBtn = document.getElementById('return-btn');
    const returnDateContainer = document.getElementById('return-date-container');

    if (oneWayBtn && returnBtn && returnDateContainer) {
        oneWayBtn.addEventListener('click', function() {
            oneWayBtn.classList.add('active');
            returnBtn.classList.remove('active');
            returnDateContainer.style.display = 'none';
        });
        returnBtn.addEventListener('click', function() {
            returnBtn.classList.add('active');
            oneWayBtn.classList.remove('active');
            returnDateContainer.style.display = 'block';
        });
    }
});
