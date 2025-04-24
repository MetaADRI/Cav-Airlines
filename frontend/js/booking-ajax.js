// booking-ajax.js
// Handles AJAX booking form submission for CAVAIR

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
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
            formData.append('user_id', userId);

            // 2. Set id_type to 'Passport' by default
            formData.append('id_type', 'Passport');

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
                // 4. Fetch flight_number from backend using origin & destination
                const flightRes = await fetch('../backend/get_flight_number.php?origin=' + encodeURIComponent(origin) + '&destination=' + encodeURIComponent(destination));
                const flightData = await flightRes.json();
                if (!flightData.success || !flightData.flight_number) {
                    throw new Error('Could not find flight for selected route.');
                }
                formData.append('flight_number', flightData.flight_number);

                // 5. Fetch schedule_id from backend using flight_number & departure_date
                const schedRes = await fetch('../backend/get_schedule_id.php?flight_number=' + encodeURIComponent(flightData.flight_number) + '&departure_date=' + encodeURIComponent(departureDate));
                const schedData = await schedRes.json();
                if (!schedData.success || !schedData.schedule_id) {
                    throw new Error('Could not find schedule for selected flight and date.');
                }
                formData.append('schedule_id', schedData.schedule_id);
            } catch (err) {
                if (serverErrorDiv) {
                    serverErrorDiv.textContent = err.message;
                    serverErrorDiv.style.display = 'block';
                }
                bookNowBtn.disabled = false;
                bookNowBtn.textContent = 'Book Now';
                return;
            }

            fetch('../backend/booking.php', {
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
