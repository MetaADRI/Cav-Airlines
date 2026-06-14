// booking-ajax.js
// Handles AJAX booking form submission for CAVAIR

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Trip type toggle logic
    const isRoundTripInput = document.getElementById('is-round-trip');
    const returnBtn = document.getElementById('return-btn');
    const oneWayBtn = document.getElementById('one-way-btn');
    if (isRoundTripInput && returnBtn && oneWayBtn) {
        returnBtn.addEventListener('click', function() {
            isRoundTripInput.value = '1';
            returnBtn.classList.add('active');
            oneWayBtn.classList.remove('active');
            // Show return date field
            document.getElementById('return-date-container').style.display = '';
        });
        oneWayBtn.addEventListener('click', function() {
            isRoundTripInput.value = '0';
            oneWayBtn.classList.add('active');
            returnBtn.classList.remove('active');
            // Hide return date field
            document.getElementById('return-date-container').style.display = 'none';
            // Optionally clear the return date value
            document.getElementById('return-date').value = '';
        });
    }
    const bookingForm = document.getElementById('booking-form');
    const bookNowBtn = document.getElementById('book-now-btn');

    if (bookingForm && bookNowBtn) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            // Clear previous errors
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            // Hide server error message on new submit
            const serverErrorDiv = document.getElementById('booking-server-error');
            if (serverErrorDiv) {
                serverErrorDiv.textContent = '';
                serverErrorDiv.style.display = 'none';
            }

            bookNowBtn.disabled = true;
            bookNowBtn.textContent = 'Booking...';

            const formData = new FormData(bookingForm);

            // 1. Set user_id from session/localStorage
            const userId = sessionStorage.getItem('user_id') || localStorage.getItem('user_id') || '';
            if (!userId) {
                if (serverErrorDiv) {
                    serverErrorDiv.textContent = 'You must be logged in to book.';
                    serverErrorDiv.style.display = 'block';
                }
                bookNowBtn.disabled = false;
                bookNowBtn.textContent = 'Book Now';
                return;
            }
            formData.set('user_id', userId);

            // 2. Set id_type to 'Passport' by default
            formData.set('id_type', 'Passport');

            // 3. Get origin, destination, and departure date from form
            const origin = document.getElementById('from-location').value.trim();
            const destination = document.getElementById('to-location').value.trim();
            const departureDate = document.getElementById('departure-date').value;
            if (!origin || !destination || !departureDate) {
                if (serverErrorDiv) {
                    serverErrorDiv.textContent = 'Please fill in origin, destination, and departure date.';
                    serverErrorDiv.style.display = 'block';
                }
                bookNowBtn.disabled = false;
                bookNowBtn.textContent = 'Book Now';
                return;
            }

            try {
                // Always append num_passengers and amount from the form/DOM for backend
                const passengers = parseInt(document.getElementById('passengers').value, 10) || 1;
                formData.set('num_passengers', passengers);
                // Get price from price span (strip 'ZMW' and commas)
                const priceText = document.getElementById('booking-total-price').textContent || '';
                let price = 0;
                if (priceText) {
                    price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
                }
                formData.set('amount', price);
                // 4. Fetch flight and schedule info from backend using origin & destination
                const flightRes = await fetch('/api/flights/schedule-id?origin=' + encodeURIComponent(origin) + '&destination=' + encodeURIComponent(destination));
                const flightData = await flightRes.json();
                
                if (!flightData.schedule_id) {
                    throw new Error('Could not find flight for selected route.');
                }
                
                formData.set('schedule_id', flightData.schedule_id);
                formData.set('flight_number', flightData.flight_number);
                formData.set('service_type', flightData.type);
            } catch (err) {
                if (serverErrorDiv) {
                    serverErrorDiv.textContent = err.message;
                    serverErrorDiv.style.display = 'block';
                }
                bookNowBtn.disabled = false;
                bookNowBtn.textContent = 'Book Now';
                return;
            }

            fetch('/api/bookings/create', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Show success message below button
                    if (serverErrorDiv) {
                        serverErrorDiv.textContent = 'Booking successful!';
                        serverErrorDiv.style.display = 'block';
                        serverErrorDiv.style.color = 'green';
                    }
                    bookingForm.reset();
                } else {
                    if (data.error && serverErrorDiv) {
                        serverErrorDiv.textContent = data.error;
                        serverErrorDiv.style.display = 'block';
                        serverErrorDiv.style.color = '';
                    }
                }
            })
            .catch(() => {
                // Show error message below the Book Now button
                if (serverErrorDiv) {
                    serverErrorDiv.textContent = 'An error occurred while processing your booking.';
                    serverErrorDiv.style.display = 'block';
                    serverErrorDiv.style.color = '';
                }
            })
            .finally(() => {
                bookNowBtn.disabled = false;
                bookNowBtn.textContent = 'Book Now';
            });
        });
    }
});
