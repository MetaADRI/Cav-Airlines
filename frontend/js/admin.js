document.addEventListener('DOMContentLoaded', function() {
    // Sidebar navigation logic
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.admin-section');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const sectionId = 'admin-section-' + this.getAttribute('data-section');
            sections.forEach(sec => sec.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Stub: AJAX load management content for each section
    async function loadUsers() {
    const container = document.getElementById('users-management');
    container.innerHTML = '<p>Loading users...</p>';
    try {
        const res = await fetch('/admin/manage_users.php');
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Failed to load users');
        // Render users table
        let html = `
            <h3>All Users</h3>
            <table class="admin-table">
                <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Actions</th></tr></thead>
                <tbody>
        `;
        for (const user of data.users) {
            html += `<tr data-user-id="${user.user_id}">
                <td>${user.user_id}</td>
                <td><span class="user-name">${user.name}</span></td>
                <td><span class="user-email">${user.email}</span></td>
                <td><span class="user-phone">${user.phone}</span></td>
                <td><span class="user-role">${user.role}</span></td>
                <td>
                    <button class="admin-btn edit-user-btn">Edit</button>
                    <button class="admin-btn delete-user-btn">Delete</button>
                </td>
            </tr>`;
        }
        html += '</tbody></table>';
        // Add user form
        html += `
            <h3>Add New User</h3>
            <form id="add-user-form" class="admin-form">
                <input type="text" name="name" placeholder="Name" required />
                <input type="email" name="email" placeholder="Email" required />
                <input type="text" name="phone" placeholder="Phone" required />
                <select name="role" required>
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit" class="admin-btn">Add User</button>
            </form>
            <div id="user-message"></div>
        `;
        container.innerHTML = html;

        // Add event listeners for edit/delete
        container.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const tr = this.closest('tr');
                const userId = tr.getAttribute('data-user-id');
                if (!confirm('Delete this user?')) return;
                const res = await fetch('/admin/manage_users.php', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: JSON.stringify({ user_id: userId })
                });
                const data = await res.json();
                if (data.success) {
                    tr.remove();
                } else {
                    showUserMessage(data.error || 'Delete failed', true);
                }
            });
        });
        container.querySelectorAll('.edit-user-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tr = this.closest('tr');
                const userId = tr.getAttribute('data-user-id');
                // Inline edit
                tr.innerHTML = `
                    <td>${userId}</td>
                    <td><input type="text" value="${tr.querySelector('.user-name').textContent}" class="edit-name" /></td>
                    <td><input type="email" value="${tr.querySelector('.user-email').textContent}" class="edit-email" /></td>
                    <td><input type="text" value="${tr.querySelector('.user-phone').textContent}" class="edit-phone" /></td>
                    <td><select class="edit-role">
                        <option value="user" ${tr.querySelector('.user-role').textContent === 'user' ? 'selected' : ''}>User</option>
                        <option value="admin" ${tr.querySelector('.user-role').textContent === 'admin' ? 'selected' : ''}>Admin</option>
                    </select></td>
                    <td>
                        <button class="admin-btn save-user-btn">Save</button>
                        <button class="admin-btn cancel-edit-btn">Cancel</button>
                    </td>
                `;
                tr.querySelector('.save-user-btn').addEventListener('click', async function() {
                    const name = tr.querySelector('.edit-name').value.trim();
                    const email = tr.querySelector('.edit-email').value.trim();
                    const phone = tr.querySelector('.edit-phone').value.trim();
                    const role = tr.querySelector('.edit-role').value;
                    const res = await fetch('/admin/manage_users.php', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_id: userId, name, email, phone, role })
                    });
                    const data = await res.json();
                    if (data.success) {
                        loadUsers();
                    } else {
                        showUserMessage(data.error || 'Update failed', true);
                    }
                });
                tr.querySelector('.cancel-edit-btn').addEventListener('click', loadUsers);
            });
        });
        // Add user form
        container.querySelector('#add-user-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const form = e.target;
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const phone = form.phone.value.trim();
            const role = form.role.value;
            const res = await fetch('/admin/manage_users.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, role })
            });
            const data = await res.json();
            if (data.success) {
                form.reset();
                loadUsers();
                showUserMessage('User added successfully');
            } else {
                showUserMessage(data.error || 'Add failed', true);
            }
        });
        function showUserMessage(msg, isError) {
            const msgDiv = container.querySelector('#user-message');
            msgDiv.textContent = msg;
            msgDiv.style.color = isError ? 'red' : 'green';
            setTimeout(() => { msgDiv.textContent = ''; }, 3000);
        }
    } catch (err) {
        container.innerHTML = `<p style='color:red;'>${err.message}</p>`;
    }
}

    async function loadFlights() {
        const container = document.getElementById('flights-management');
        container.innerHTML = '<p>Loading flights...</p>';
        try {
            const res = await fetch('/admin/manage_flights.php');
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Failed to load flights');
            let html = `
                <h3>All Flights</h3>
                <table class="admin-table">
                    <thead><tr><th>Flight #</th><th>Origin</th><th>Destination</th><th>Type</th><th>Price</th><th>Actions</th></tr></thead>
                    <tbody>
            `;
            for (const flight of data.flights) {
                html += `<tr data-flight-number="${flight.flight_number}">
                    <td>${flight.flight_number}</td>
                    <td><span class="flight-origin">${flight.origin}</span></td>
                    <td><span class="flight-destination">${flight.destination}</span></td>
                    <td><span class="flight-type">${flight.type}</span></td>
                    <td><span class="flight-price">${flight.price}</span></td>
                    <td>
                        <button class="admin-btn edit-flight-btn">Edit</button>
                        <button class="admin-btn delete-flight-btn">Delete</button>
                    </td>
                </tr>`;
            }
            html += '</tbody></table>';
            // Add flight form
            html += `
                <h3>Add New Flight</h3>
                <form id="add-flight-form" class="admin-form">
                    <input type="text" name="flight_number" placeholder="Flight Number" required />
                    <input type="text" name="origin" placeholder="Origin" required />
                    <input type="text" name="destination" placeholder="Destination" required />
                    <input type="text" name="type" placeholder="Type" required />
                    <input type="number" name="price" placeholder="Price" min="0" required />
                    <button type="submit" class="admin-btn">Add Flight</button>
                </form>
                <div id="flight-message"></div>
            `;
            container.innerHTML = html;
            // Delete
            container.querySelectorAll('.delete-flight-btn').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const tr = this.closest('tr');
                    const flightNumber = tr.getAttribute('data-flight-number');
                    if (!confirm('Delete this flight?')) return;
                    const res = await fetch('/admin/manage_flights.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ flight_number: flightNumber })
                    });
                    const data = await res.json();
                    if (data.success) {
                        tr.remove();
                    } else {
                        showFlightMessage(data.error || 'Delete failed', true);
                    }
                });
            });
            // Edit
            container.querySelectorAll('.edit-flight-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const tr = this.closest('tr');
                    const flightNumber = tr.getAttribute('data-flight-number');
                    tr.innerHTML = `
                        <td>${flightNumber}</td>
                        <td><input type="text" value="${tr.querySelector('.flight-origin').textContent}" class="edit-origin" /></td>
                        <td><input type="text" value="${tr.querySelector('.flight-destination').textContent}" class="edit-destination" /></td>
                        <td><input type="text" value="${tr.querySelector('.flight-type').textContent}" class="edit-type" /></td>
                        <td><input type="number" value="${tr.querySelector('.flight-price').textContent}" class="edit-price" min="0" /></td>
                        <td>
                            <button class="admin-btn save-flight-btn">Save</button>
                            <button class="admin-btn cancel-edit-btn">Cancel</button>
                        </td>
                    `;
                    tr.querySelector('.save-flight-btn').addEventListener('click', async function() {
                        const origin = tr.querySelector('.edit-origin').value.trim();
                        const destination = tr.querySelector('.edit-destination').value.trim();
                        const type = tr.querySelector('.edit-type').value.trim();
                        const price = tr.querySelector('.edit-price').value.trim();
                        const res = await fetch('/admin/manage_flights.php', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ flight_number: flightNumber, origin, destination, type, price })
                        });
                        const data = await res.json();
                        if (data.success) {
                            loadFlights();
                        } else {
                            showFlightMessage(data.error || 'Update failed', true);
                        }
                    });
                    tr.querySelector('.cancel-edit-btn').addEventListener('click', loadFlights);
                });
            });
            // Add flight
            container.querySelector('#add-flight-form').addEventListener('submit', async function(e) {
                e.preventDefault();
                const form = e.target;
                const flight_number = form.flight_number.value.trim();
                const origin = form.origin.value.trim();
                const destination = form.destination.value.trim();
                const type = form.type.value.trim();
                const price = form.price.value.trim();
                const res = await fetch('/admin/manage_flights.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ flight_number, origin, destination, type, price })
                });
                const data = await res.json();
                if (data.success) {
                    form.reset();
                    loadFlights();
                    showFlightMessage('Flight added successfully');
                } else {
                    showFlightMessage(data.error || 'Add failed', true);
                }
            });
            function showFlightMessage(msg, isError) {
                const msgDiv = container.querySelector('#flight-message');
                msgDiv.textContent = msg;
                msgDiv.style.color = isError ? 'red' : 'green';
                setTimeout(() => { msgDiv.textContent = ''; }, 3000);
            }
        } catch (err) {
            container.innerHTML = `<p style='color:red;'>${err.message}</p>`;
        }
    }

    async function loadSchedules() {
        const container = document.getElementById('schedules-management');
        container.innerHTML = '<p>Loading schedules...</p>';
        try {
            const res = await fetch('/admin/manage_schedules.php');
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Failed to load schedules');
            let html = `
                <h3>All Schedules</h3>
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>Flight #</th><th>Departure Date</th><th>Departure Time</th><th>Arrival Time</th><th>Actions</th></tr></thead>
                    <tbody>
            `;
            for (const sched of data.schedules) {
                html += `<tr data-schedule-id="${sched.schedule_id}">
                    <td>${sched.schedule_id}</td>
                    <td><span class="sched-flight-number">${sched.flight_number}</span></td>
                    <td><span class="sched-departure-date">${sched.departure_date}</span></td>
                    <td><span class="sched-departure-time">${sched.departure_time}</span></td>
                    <td><span class="sched-arrival-time">${sched.arrival_time}</span></td>
                    <td>
                        <button class="admin-btn edit-sched-btn">Edit</button>
                        <button class="admin-btn delete-sched-btn">Delete</button>
                    </td>
                </tr>`;
            }
            html += '</tbody></table>';
            // Add schedule form
            html += `
                <h3>Add New Schedule</h3>
                <form id="add-sched-form" class="admin-form">
                    <input type="text" name="flight_number" placeholder="Flight Number" required />
                    <input type="date" name="departure_date" placeholder="Departure Date" required />
                    <input type="time" name="departure_time" placeholder="Departure Time" required />
                    <input type="time" name="arrival_time" placeholder="Arrival Time" required />
                    <button type="submit" class="admin-btn">Add Schedule</button>
                </form>
                <div id="sched-message"></div>
            `;
            container.innerHTML = html;
            // Delete
            container.querySelectorAll('.delete-sched-btn').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const tr = this.closest('tr');
                    const scheduleId = tr.getAttribute('data-schedule-id');
                    if (!confirm('Delete this schedule?')) return;
                    const res = await fetch('/admin/manage_schedules.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ schedule_id: scheduleId })
                    });
                    const data = await res.json();
                    if (data.success) {
                        tr.remove();
                    } else {
                        showSchedMessage(data.error || 'Delete failed', true);
                    }
                });
            });
            // Edit
            container.querySelectorAll('.edit-sched-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const tr = this.closest('tr');
                    const scheduleId = tr.getAttribute('data-schedule-id');
                    tr.innerHTML = `
                        <td>${scheduleId}</td>
                        <td><input type="text" value="${tr.querySelector('.sched-flight-number').textContent}" class="edit-flight-number" /></td>
                        <td><input type="date" value="${tr.querySelector('.sched-departure-date').textContent}" class="edit-departure-date" /></td>
                        <td><input type="time" value="${tr.querySelector('.sched-departure-time').textContent}" class="edit-departure-time" /></td>
                        <td><input type="time" value="${tr.querySelector('.sched-arrival-time').textContent}" class="edit-arrival-time" /></td>
                        <td>
                            <button class="admin-btn save-sched-btn">Save</button>
                            <button class="admin-btn cancel-edit-btn">Cancel</button>
                        </td>
                    `;
                    tr.querySelector('.save-sched-btn').addEventListener('click', async function() {
                        const flight_number = tr.querySelector('.edit-flight-number').value.trim();
                        const departure_date = tr.querySelector('.edit-departure-date').value.trim();
                        const departure_time = tr.querySelector('.edit-departure-time').value.trim();
                        const arrival_time = tr.querySelector('.edit-arrival-time').value.trim();
                        const res = await fetch('/admin/manage_schedules.php', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ schedule_id: scheduleId, flight_number, departure_date, departure_time, arrival_time })
                        });
                        const data = await res.json();
                        if (data.success) {
                            loadSchedules();
                        } else {
                            showSchedMessage(data.error || 'Update failed', true);
                        }
                    });
                    tr.querySelector('.cancel-edit-btn').addEventListener('click', loadSchedules);
                });
            });
            // Add schedule
            container.querySelector('#add-sched-form').addEventListener('submit', async function(e) {
                e.preventDefault();
                const form = e.target;
                const flight_number = form.flight_number.value.trim();
                const departure_date = form.departure_date.value.trim();
                const departure_time = form.departure_time.value.trim();
                const arrival_time = form.arrival_time.value.trim();
                const res = await fetch('/admin/manage_schedules.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ flight_number, departure_date, departure_time, arrival_time })
                });
                const data = await res.json();
                if (data.success) {
                    form.reset();
                    loadSchedules();
                    showSchedMessage('Schedule added successfully');
                } else {
                    showSchedMessage(data.error || 'Add failed', true);
                }
            });
            function showSchedMessage(msg, isError) {
                const msgDiv = container.querySelector('#sched-message');
                msgDiv.textContent = msg;
                msgDiv.style.color = isError ? 'red' : 'green';
                setTimeout(() => { msgDiv.textContent = ''; }, 3000);
            }
        } catch (err) {
            container.innerHTML = `<p style='color:red;'>${err.message}</p>`;
        }
    }

    async function loadBookings() {
        const container = document.getElementById('bookings-management');
        container.innerHTML = '<p>Loading bookings...</p>';
        try {
            const res = await fetch('/admin/manage_bookings.php');
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Failed to load bookings');
            let html = `
                <h3>All Bookings</h3>
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>User ID</th><th>Schedule ID</th><th>Seat #</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
            `;
            for (const booking of data.bookings) {
                html += `<tr data-booking-id="${booking.booking_id}">
                    <td>${booking.booking_id}</td>
                    <td><span class="booking-user-id">${booking.user_id}</span></td>
                    <td><span class="booking-schedule-id">${booking.schedule_id}</span></td>
                    <td><span class="booking-seat-number">${booking.seat_number}</span></td>
                    <td><span class="booking-status">${booking.status}</span></td>
                    <td>
                        <button class="admin-btn edit-booking-btn">Edit</button>
                        <button class="admin-btn delete-booking-btn">Delete</button>
                    </td>
                </tr>`;
            }
            html += '</tbody></table>';
            // Add booking form
            html += `
                <h3>Add New Booking</h3>
                <form id="add-booking-form" class="admin-form">
                    <input type="number" name="user_id" placeholder="User ID" required />
                    <input type="number" name="schedule_id" placeholder="Schedule ID" required />
                    <input type="text" name="seat_number" placeholder="Seat Number" required />
                    <input type="text" name="status" placeholder="Status" required />
                    <button type="submit" class="admin-btn">Add Booking</button>
                </form>
                <div id="booking-message"></div>
            `;
            container.innerHTML = html;
            // Delete
            container.querySelectorAll('.delete-booking-btn').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const tr = this.closest('tr');
                    const bookingId = tr.getAttribute('data-booking-id');
                    if (!confirm('Delete this booking?')) return;
                    const res = await fetch('/admin/manage_bookings.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ booking_id: bookingId })
                    });
                    const data = await res.json();
                    if (data.success) {
                        tr.remove();
                    } else {
                        showBookingMessage(data.error || 'Delete failed', true);
                    }
                });
            });
            // Edit
            container.querySelectorAll('.edit-booking-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const tr = this.closest('tr');
                    const bookingId = tr.getAttribute('data-booking-id');
                    tr.innerHTML = `
                        <td>${bookingId}</td>
                        <td><input type="number" value="${tr.querySelector('.booking-user-id').textContent}" class="edit-user-id" /></td>
                        <td><input type="number" value="${tr.querySelector('.booking-schedule-id').textContent}" class="edit-schedule-id" /></td>
                        <td><input type="text" value="${tr.querySelector('.booking-seat-number').textContent}" class="edit-seat-number" /></td>
                        <td><input type="text" value="${tr.querySelector('.booking-status').textContent}" class="edit-status" /></td>
                        <td>
                            <button class="admin-btn save-booking-btn">Save</button>
                            <button class="admin-btn cancel-edit-btn">Cancel</button>
                        </td>
                    `;
                    tr.querySelector('.save-booking-btn').addEventListener('click', async function() {
                        const user_id = tr.querySelector('.edit-user-id').value.trim();
                        const schedule_id = tr.querySelector('.edit-schedule-id').value.trim();
                        const seat_number = tr.querySelector('.edit-seat-number').value.trim();
                        const status = tr.querySelector('.edit-status').value.trim();
                        const res = await fetch('/admin/manage_bookings.php', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ booking_id: bookingId, user_id, schedule_id, seat_number, status })
                        });
                        const data = await res.json();
                        if (data.success) {
                            loadBookings();
                        } else {
                            showBookingMessage(data.error || 'Update failed', true);
                        }
                    });
                    tr.querySelector('.cancel-edit-btn').addEventListener('click', loadBookings);
                });
            });
            // Add booking
            container.querySelector('#add-booking-form').addEventListener('submit', async function(e) {
                e.preventDefault();
                const form = e.target;
                const user_id = form.user_id.value.trim();
                const schedule_id = form.schedule_id.value.trim();
                const seat_number = form.seat_number.value.trim();
                const status = form.status.value.trim();
                const res = await fetch('/admin/manage_bookings.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id, schedule_id, seat_number, status })
                });
                const data = await res.json();
                if (data.success) {
                    form.reset();
                    loadBookings();
                    showBookingMessage('Booking added successfully');
                } else {
                    showBookingMessage(data.error || 'Add failed', true);
                }
            });
            function showBookingMessage(msg, isError) {
                const msgDiv = container.querySelector('#booking-message');
                msgDiv.textContent = msg;
                msgDiv.style.color = isError ? 'red' : 'green';
                setTimeout(() => { msgDiv.textContent = ''; }, 3000);
            }
        } catch (err) {
            container.innerHTML = `<p style='color:red;'>${err.message}</p>`;
        }
    }


    // Initial load
    loadUsers();

    // Optionally, load content on tab switch
    document.querySelector('[data-section="users"]').addEventListener('click', loadUsers);
    document.querySelector('[data-section="flights"]').addEventListener('click', loadFlights);
    document.querySelector('[data-section="schedules"]').addEventListener('click', loadSchedules);
    document.querySelector('[data-section="bookings"]').addEventListener('click', loadBookings);
});
