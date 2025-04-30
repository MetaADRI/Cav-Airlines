# CAVAIR – CAV-Zambia Airlines Reservation System

## Overview

CAVAIR is a modern, full-featured web application for airline booking, management, and administration, built for the Zambian air travel market. It enables passengers to search and book flights, and allows airline staff to manage flights, schedules, users, and bookings through a secure, user-friendly interface.

## Features

- Home page with image carousel, auto-loading video, flight schedules, and social media links
- Services page with dropdown for Domestic/International, multimedia, and service details
- Booking form with ID/Passport upload, validation, and instant feedback
- User dashboard for managing bookings and profile
- Admin dashboard for managing users, flights, schedules, and bookings
- RESTful backend API (PHP & MySQL)
- Secure authentication, session management, and role-based access
- Responsive design for desktop and mobile

## Project Structure

```
CAV-Zambia-Airlines/
├── admin/        # Admin PHP scripts (user, flight, schedule, booking management)
├── backend/      # PHP backend, DB schema, booking logic, utilities
├── frontend/     # HTML, CSS, JS, assets (images, videos, etc.)
├── docs/         # Documentation, user manual, schema, etc.
└── README.md     # This file

``` 
See `docs/file_schema.md` for a full breakdown.

## Getting Started

1. **Clone or download** the repository.
2. **Backend:**
   - Requires PHP 7.4+ and MySQL 8.0+
   - Import `backend/group2_cavair_db_setup.sql` into your MySQL server
   - Configure DB credentials in `backend/utils/db_connect.php`
3. **Frontend:**
   - Open `frontend/home.html` in your browser (or deploy to a web server)
   - All static assets are in `frontend/assets/`
4. **Admin:**
   - Access admin features via `frontend/admin.html` (requires admin login)

## Security

- Passwords are securely hashed
- All input is validated and sanitized
- File uploads are checked for type/size
- Admin APIs are protected by role-based access
- HTTPS recommended for deployment

## Documentation

- System documentation: `docs/documentation.md`
- File schema: `docs/file_schema.md`
- User manual: `docs/user_reference_manual.md`

## Credits

- Developed by COM322 - Group 2
- Uses Font Awesome, Google Maps API

---
