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
        const res = await fetch('/api/admin/users');
        const users = await res.json();
        // Render users table
        let html = `
            <h3>All Users</h3>
            <table class="admin-table">
                <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
                <tbody>
        `;
        for (const user of users) {
            html += `<tr data-user-id="${user.user_id}">
                <td>${user.user_id}</td>
                <td><span class="user-name">${user.full_name}</span></td>
                <td><span class="user-email">${user.email}</span></td>
                <td><span class="user-phone">${user.phone}</span></td>
                <td>
                    <button class="admin-btn delete-user-btn">Delete</button>
                </td>
            </tr>`;
        }
        html += '</tbody></table>';
        container.innerHTML = html;
        // Delete
        container.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const tr = this.closest('tr');
                const userId = tr.getAttribute('data-user-id');
                if (!confirm('Delete this user?')) return;
                const res = await fetch(`/api/admin/users/${userId}`, {
                    method: 'DELETE'
                });
                const data = await res.json();
                if (data.success) {
                    tr.remove();
                } else {
                    alert(data.message || 'Delete failed');
                }
            });
        });
    } catch (err) {
        container.innerHTML = `<p style='color:red;'>${err.message}</p>`;
    }
}

    async function loadFlights() {
        const container = document.getElementById('flights-management');
        container.innerHTML = '<p>Loading flights...</p>';
        try {
            const res = await fetch('/api/admin/flights');
            const flights = await res.json();
            let html = `
                <h3>All Flights</h3>
                <table class="admin-table">
                    <thead><tr><th>Flight #</th><th>Origin</th><th>Destination</th><th>Type</th><th>Price</th><th>Actions</th></tr></thead>
                    <tbody>
            `;
            for (const flight of flights) {
                html += `<tr data-flight-id="${flight.flight_id}">
                    <td>${flight.flight_number}</td>
                    <td>${flight.origin}</td>
                    <td>${flight.destination}</td>
                    <td>${flight.type}</td>
                    <td>${flight.price}</td>
                    <td>
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
                    <select name="type" required>
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                    </select>
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
                    const flightId = tr.getAttribute('data-flight-id');
                    if (!confirm('Delete this flight?')) return;
                    const res = await fetch(`/api/admin/flights/${flightId}`, {
                        method: 'DELETE'
                    });
                    const data = await res.json();
                    if (data.success) {
                        tr.remove();
                    } else {
                        alert(data.message || 'Delete failed');
                    }
                });
            });
            // Add flight
            container.querySelector('#add-flight-form').addEventListener('submit', async function(e) {
                e.preventDefault();
                const form = e.target;
                const formData = new FormData(form);
                const res = await fetch('/api/admin/flights/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(Object.fromEntries(formData))
                });
                const data = await res.json();
                if (data.success) {
                    form.reset();
                    loadFlights();
                } else {
                    alert(data.message || 'Add failed');
                }
            });
        } catch (err) {
            container.innerHTML = `<p style='color:red;'>${err.message}</p>`;
        }
    }

    async function loadBookings() {
        const container = document.getElementById('bookings-management');
        container.innerHTML = '<p>Loading bookings...</p>';
        try {
            const res = await fetch('/api/admin/bookings');
            const bookings = await res.json();
            let html = `
                <h3>All Bookings</h3>
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>User</th><th>Flight #</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
            `;
            for (const b of bookings) {
                html += `<tr data-booking-id="${b.booking_id}">
                    <td>${b.booking_id}</td>
                    <td>${b.name}</td>
                    <td>${b.flight_number}</td>
                    <td>
                        <select class="status-select">
                            <option value="Pending" ${b.booking_status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Confirmed" ${b.booking_status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="Cancelled" ${b.booking_status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </td>
                    <td>
                        <button class="admin-btn update-booking-btn">Update</button>
                    </td>
                </tr>`;
            }
            html += '</tbody></table>';
            container.innerHTML = html;
            
            container.querySelectorAll('.update-booking-btn').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const tr = this.closest('tr');
                    const bookingId = tr.getAttribute('data-booking-id');
                    const status = tr.querySelector('.status-select').value;
                    const res = await fetch('/api/admin/bookings/update-status', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ booking_id: bookingId, status })
                    });
                    const data = await res.json();
                    if (data.success) {
                        alert('Status updated');
                    } else {
                        alert(data.message || 'Update failed');
                    }
                });
            });
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
