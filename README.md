# CAVAIR – CAV-Zambia Airlines Reservation System

## Overview

CAVAIR is a modern, full-featured web application for airline booking, management, and administration, built for the Zambian air travel market. It enables passengers to search and book flights, and allows airline staff to manage flights, schedules, users, and bookings through a secure, user-friendly interface.

## Features

- Home page with image carousel, auto-loading video, flight schedules, and social media links
- Services page with dropdown for Domestic/International, multimedia, and service details
- Booking form with ID/Passport upload, validation, and instant feedback
- User dashboard for managing bookings and profile
- Admin dashboard for managing users, flights, schedules, and bookings
- RESTful backend API (Node.js & Express)
- SQLite database for easy setup and portability
- Secure authentication, session management, and role-based access
- Responsive design for desktop and mobile

## Project Structure

```
CAV-Zambia-Airlines/
├── frontend/     # HTML, CSS, JS, assets (images, videos, etc.)
├── routes/       # Express API routes
├── docs/         # Documentation, user manual, schema, etc.
├── db.js         # SQLite database connection
├── migrate.js    # Database migration and seeding script
├── server.js     # Express server entry point
└── README.md     # This file
```

## Getting Started

1. **Clone or download** the repository.
2. **Setup:**
   - Requires [Node.js](https://nodejs.org/) installed.
   - Run `npm install` to install dependencies.
   - Run `node migrate.js` to initialize and seed the SQLite database.
3. **Running the App:**
   - Run `node server.js` to start the server.
   - The app will be available at `http://localhost:3000`.
4. **Admin:**
   - Access admin features via `frontend/admin.html` (requires admin login).

## Security

- Passwords are securely hashed using bcrypt.
- All input is validated and sanitized.
- File uploads are handled securely with multer.
- Admin APIs are protected by role-based access.

## Documentation

- System documentation: `docs/documentation.md`
- File schema: `docs/file_schema.md`
- User manual: `docs/user_reference_manual.md`

## Credits

- Developed by COM322 - Group 2
- Uses Font Awesome, Google Maps API

---
