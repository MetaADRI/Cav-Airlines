// --- USER DASHBOARD LOGIC ---

document.addEventListener('DOMContentLoaded', function() {
    // --- HEADER BLUR ON SCROLL ---
    const header = document.querySelector('.cav-header');
    function handleHeaderBlur() {
        if (window.scrollY > 0) {
            header && header.classList.add('scrolled');
        } else {
            header && header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleHeaderBlur);
    handleHeaderBlur();

    // --- USER DATA ---
    if (!sessionStorage.getItem('user_id') && localStorage.getItem('user_id')) {
        sessionStorage.setItem('user_id', localStorage.getItem('user_id'));
        sessionStorage.setItem('cavair_full_name', localStorage.getItem('cavair_full_name'));
        sessionStorage.setItem('cavair_email', localStorage.getItem('cavair_email'));
        sessionStorage.setItem('cavair_phone', localStorage.getItem('cavair_phone'));
    }
    const userId = sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
    let userName = sessionStorage.getItem('cavair_full_name') || localStorage.getItem('cavair_full_name');
    if (!userId || !userName) {
        window.location.href = 'login.html';
        return;
    }
    let userEmail = sessionStorage.getItem('cavair_email') || localStorage.getItem('cavair_email') || '';
    let userPhone = sessionStorage.getItem('cavair_phone') || localStorage.getItem('cavair_phone') || '';
    const userPassword = '********'; // Never store password in plain text

    // --- HERO SECTION ---
    const usernameSpan = document.getElementById('dashboard-username');
    if (usernameSpan) usernameSpan.textContent = userName;

    // --- TABS LOGIC ---
    const tabs = document.querySelectorAll('.dashboard-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            tabContents.forEach(tc => tc.style.display = 'none');
            if (tab.id === 'tab-trips') {
                document.getElementById('tab-trips-content').style.display = 'block';
            } else {
                document.getElementById('tab-profile-content').style.display = 'block';
            }
        });
    });

    // --- SIDEBAR LOGIC ---
    const sidebarDashboard = document.getElementById('sidebar-dashboard');
    const sidebarManage = document.getElementById('sidebar-manage');
    const dashboardSection = document.getElementById('dashboard-section');
    const manageSection = document.getElementById('manage-section');
    if (sidebarDashboard && sidebarManage && dashboardSection && manageSection) {
        sidebarDashboard.addEventListener('click', function() {
            sidebarDashboard.classList.add('active');
            sidebarManage.classList.remove('active');
            dashboardSection.style.display = 'block';
            manageSection.style.display = 'none';
        });
        sidebarManage.addEventListener('click', function() {
            sidebarDashboard.classList.remove('active');
            sidebarManage.classList.add('active');
            dashboardSection.style.display = 'none';
            manageSection.style.display = 'block';
        });
    }

    // --- PROFILE TAB LOGIC ---
    // View mode
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profilePhone = document.getElementById('profile-phone');
    const profilePassword = document.getElementById('profile-password');
    // Edit mode
    const editProfileLink = document.getElementById('edit-profile-link');
    const saveProfileLink = document.getElementById('save-profile-link');
    const cancelProfileLink = document.getElementById('cancel-profile-link');
    const profileView = document.getElementById('profile-view-mode');
    const profileEdit = document.getElementById('profile-edit-mode');
    const editNameStatic = document.getElementById('edit-name-static');
    const editEmail = document.getElementById('edit-email');
    const editPhone = document.getElementById('edit-phone');
    const editPasswordStatic = document.getElementById('edit-password-static');
    const profileMessage = document.getElementById('profile-message');

    function populateProfileView() {
        if (profileName) profileName.textContent = userName;
        if (profileEmail) profileEmail.textContent = userEmail;
        if (profilePhone) profilePhone.textContent = userPhone;
        if (profilePassword) profilePassword.textContent = userPassword;
    }
    populateProfileView();

    function setEditFields() {
        if (editNameStatic) editNameStatic.textContent = userName;
        if (editPasswordStatic) editPasswordStatic.textContent = '********';
        if (editEmail) editEmail.value = userEmail;
        if (editPhone) editPhone.value = userPhone;
    }

    // Floating label JS for profile edit (email/phone)
    function setupFloatingLabels() {
        const floatingInputs = document.querySelectorAll('.profile-input');
        floatingInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.classList.add('focused');
                this.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.classList.remove('focused');
                    this.parentElement.classList.remove('focused');
                }
            });
            if (input.value !== '') {
                input.classList.add('focused');
                input.parentElement.classList.add('focused');
            }
        });
    }
    setupFloatingLabels();

    if (editProfileLink) {
        editProfileLink.addEventListener('click', function(e) {
            e.preventDefault();
            setEditFields();
            if (profileView) profileView.style.display = 'none';
            if (profileEdit) profileEdit.style.display = 'flex';
            if (profileMessage) profileMessage.style.display = 'none';
            console.log('Edit button clicked: switched to edit mode');
        });
    }
    if (cancelProfileLink) {
        cancelProfileLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (profileEdit) profileEdit.style.display = 'none';
            if (profileView) profileView.style.display = 'flex';
            if (profileMessage) profileMessage.style.display = 'none';
        });
    }
    if (saveProfileLink) {
        saveProfileLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Validate and save
            const name = editNameStatic ? editNameStatic.textContent.trim() : '';
            const email = editEmail ? editEmail.value.trim() : '';
            const phone = editPhone ? editPhone.value.trim() : '';
            // No password input: skip password validation
            let hasError = false;
            let message = '';
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                hasError = true;
                message = 'Please enter a valid email address.';
            } else if (!/^\+?\d{10,15}$/.test(phone)) {
                hasError = true;
                message = 'Please enter a valid phone number.';
            }

            if (hasError) {
                if (profileMessage) {
                    profileMessage.textContent = message;
                    profileMessage.className = 'profile-message error';
                    profileMessage.style.display = 'block';
                }
                return;
            }
            // Save to session/localStorage (simulate backend update)
            sessionStorage.setItem('cavair_full_name', name);
            sessionStorage.setItem('cavair_email', email);
            sessionStorage.setItem('cavair_phone', phone);
            if (localStorage.getItem('user_id')) {
                localStorage.setItem('cavair_full_name', name);
                localStorage.setItem('cavair_email', email);
                localStorage.setItem('cavair_phone', phone);
            }
            // Update global variables so static view reflects changes
            userName = name;
            userEmail = email;
            userPhone = phone;
            populateProfileView();
            if (profileMessage) {
                profileMessage.textContent = 'Profile updated successfully!';
                profileMessage.className = 'profile-message success';
                profileMessage.style.display = 'block';
            }
            setTimeout(() => {
                if (profileEdit) profileEdit.style.display = 'none';
                if (profileView) profileView.style.display = 'flex';
                if (usernameSpan) usernameSpan.textContent = name;
                if (profileMessage) profileMessage.style.display = 'none';
            }, 1200);
        });
    }

    // --- Floating label for Manage Booking Form ---
    const manageInputs = document.querySelectorAll('.manage-input');
    manageInputs.forEach(function(input) {
        input.addEventListener('focus', function() {
            this.classList.add('focused');
            if (this.nextElementSibling && this.nextElementSibling.classList.contains('floating-label')) {
                this.nextElementSibling.classList.add('focused');
            }
        });
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.classList.remove('focused');
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('floating-label')) {
                    this.nextElementSibling.classList.remove('focused');
                }
            }
        });
        // On load, float label if input has value
        if (input.value !== '') {
            input.classList.add('focused');
            if (input.nextElementSibling && input.nextElementSibling.classList.contains('floating-label')) {
                input.nextElementSibling.classList.add('focused');
            }
        }
    });

    // --- Manage Booking Search Logic ---
    const manageBookingForm = document.getElementById('manage-booking-form');
    const manageResultsTitle = document.querySelector('.manage-results-title');
    const manageBookingResults = document.getElementById('manage-booking-results');
    // TODO: Fetch real booking data from backend API or inject bookings here

    if (manageResultsTitle) manageResultsTitle.style.display = 'none';
    if (manageBookingResults) manageBookingResults.innerHTML = '';
    if (manageBookingForm) {
        manageBookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const bookingId = document.getElementById('booking-ref').value.trim();
            const bookingName = document.getElementById('booking-name').value.trim();
            // Validation: bookingId = all digits, bookingName = only letters/spaces
            const idValid = /^\d+$/.test(bookingId);
            const nameValid = /^[A-Za-z ]+$/.test(bookingName);
            if (idValid && nameValid) {
                // Always show the Results title
                if (manageResultsTitle) manageResultsTitle.style.display = '';
                // Clear previous content
                manageBookingResults.innerHTML = '';
                // Call backend to find booking
                fetch('../backend/booking/track_booking.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `booking_ref=${encodeURIComponent(bookingId)}&name=${encodeURIComponent(bookingName)}`
                })
                .then(res => res.json())
                .then(data => {
                    console.log('Manage booking search result:', data);
                    if (data.success && data.booking) {
                        // Map backend fields to frontend expected names
                        const mapped = {
                            origin: data.booking.origin,
                            destination: data.booking.destination,
                            isRoundTrip: data.booking.isRoundTrip || false,
                            departureDate: data.booking.departure_date,
                            returnDate: data.booking.returnDate || data.booking.return_date || '',
                            departureTime: data.booking.departure_time ? data.booking.departure_time.replace(/:00$/, '') : '',
                            arrivalTime: data.booking.arrival_time ? data.booking.arrival_time.replace(/:00$/, '') : '',
                            flightNumber: data.booking.flight_number || '',
                            classType: data.booking.class_type || '',
                            passengers: data.booking.num_passengers || 1,
                            id: data.booking.booking_id || data.booking.id || ''
                        };
                        manageBookingResults.innerHTML = renderBookingInfo(mapped, true);

                    } else {
                        manageBookingResults.innerHTML = `
                            <div class="no-bookings-container">
                                <img src="assets/icons/No-Bookings-icon.svg" alt="No Bookings Icon" />
                                <div class="no-bookings-text"><strong>No Bookings</strong></div>
                            </div>`;
                    }
                })
                .catch(() => {
                    manageBookingResults.innerHTML = `
                        <div class="no-bookings-container">
                            <img src="assets/icons/No-Bookings-icon.svg" alt="No Bookings Icon" />
                            <div class="no-bookings-text"><strong>No Bookings</strong></div>
                        </div>`;
                });
            } else {
                // Hide results if invalid
                if (manageResultsTitle) manageResultsTitle.style.display = 'none';
                manageBookingResults.innerHTML = '';
            }
        });
    }
    // Hide Results when switching dashboard tabs
    const manageTab = document.getElementById('sidebar-dashboard');
    if (manageTab) {
        manageTab.addEventListener('click', function() {
            if (manageResultsTitle) manageResultsTitle.style.display = 'none';
            if (manageBookingResults) manageBookingResults.innerHTML = '';
        });
    }

    // --- TRIPS TAB LOGIC (Booking info)---
    const bookingInfoContainer = document.getElementById('booking-info-container');
    const noTripsContainer = document.querySelector('.no-trips-container');
    console.log('userId:', userId);
if (bookingInfoContainer) {
        fetch('../backend/booking/get_user_bookings.php')
            .then(res => {
                // If redirected to login.html (session expired), force logout
                if (res.redirected && res.url.includes('login.html')) {
                    sessionStorage.clear();
                    localStorage.clear();
                    window.location.href = 'login.html';
                    return;
                }
                return res.json();
            })
            .then(data => {
                if (data.success && Array.isArray(data.bookings) && data.bookings.length > 0) {
                    bookingInfoContainer.innerHTML = '';
                    data.bookings.forEach(booking => {
    // Map backend fields to frontend expected names
    const mapped = {
        origin: booking.origin,
        destination: booking.destination,
        isRoundTrip: booking.isRoundTrip || false,
        departureDate: booking.departure_date,
        returnDate: booking.returnDate || booking.return_date || '',
        departureTime: booking.departure_time ? booking.departure_time.replace(/:00$/, '') : '',
        arrivalTime: booking.arrival_time ? booking.arrival_time.replace(/:00$/, '') : '',
        flightNumber: booking.flight_number || '',
        classType: booking.class_type || '',
        passengers: booking.num_passengers || 1,
        id: booking.booking_id || booking.id || ''
    };
    bookingInfoContainer.innerHTML += renderBookingInfo(mapped);

});
                    if (noTripsContainer) {
    noTripsContainer.style.display = 'none';
    console.log('Hiding no-trips-container because bookings exist.');
}
                } else {
                    bookingInfoContainer.innerHTML = '';
                    if (noTripsContainer) noTripsContainer.style.display = 'flex';
                }
            })
            .catch(() => {
                bookingInfoContainer.innerHTML = '';
                if (noTripsContainer) noTripsContainer.style.display = 'flex';
            });
    } else if (bookingInfoContainer) {
        bookingInfoContainer.innerHTML = '';
        if (noTripsContainer) noTripsContainer.style.display = 'flex';
    }

    // Render a booking card
    function renderBookingInfo(booking, showActions = false) {
        // Date formatting helper
        function formatDateDisplay(dateStr) {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const weekday = weekdays[date.getDay()];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            return `${weekday}, ${day} ${month} ${year}`;
        }
        // Top label: route and dates
        // Debug log to check values
        console.log('Booking debug:', booking);
        let dateText = '';
        if (booking.isRoundTrip && booking.returnDate) {
            dateText = `${formatDateDisplay(booking.departureDate)} - ${formatDateDisplay(booking.returnDate)}`;
        } else {
            dateText = formatDateDisplay(booking.departureDate);
        }
        let routeLabel = `<div class="booking-route-label booking-route-rectangle">
            <span class="route-bold">${booking.origin} - ${booking.destination}</span>
            <span class="route-separator route-bold"> | </span>
            <span class="route-date">${dateText}</span>
        </div>`;
        const bookingHTML = `
        <div class="booking-outer-container">
            ${routeLabel}
            <div class="booking-info-row">
                <div class="booking-info-col">
                    <span>${booking.departureTime}</span>
                    <span class="booking-ptp-icon"><img src='assets/icons/point-to-point-icon.svg' alt='Flight Icon' style='height:18px;vertical-align:middle; margin:0 6px;'/></span>
                    <span>${booking.arrivalTime}</span>
                </div>
                <div class="booking-info-col">
                    <span class="booking-flight-num">${booking.flightNumber.replace(/\s*Flight\s*$/i, '').replace(/\s*Flight\s*/i, '').trim()}</span>
                </div>
                <div class="booking-info-col">
                    <span class="booking-class">${booking.classType.replace(/\s*Class\s*$/i, '').replace(/\s*Class\s*/i, '').trim()}</span>
                </div>
                <div class="booking-info-col">
                    <span class="booking-passengers">${booking.passengers} Passenger${booking.passengers > 1 ? 's' : ''}</span>
                </div>
            </div>
            <div class="booking-ticket-container">
                <span class="booking-ticket-label">Ticket Number:</span>
                <span class="booking-ticket-value">${booking.id}</span>
            </div>
            ${showActions ? `
            <div class=\"manage-booking-actions-bar\">
                <button class=\"manage-action-btn check-in-btn\" type=\"button\">Check In</button>
                <button class=\"manage-action-btn manage-booking-btn\" type=\"button\">Manage Booking</button>
            </div>
            ` : ''}
        </div>`;
        return bookingHTML;
    }
});
