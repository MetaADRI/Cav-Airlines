# CAVAIR Web Application Documentation | by COM322 Group 2

## Introduction & Purpose

CAVAIR (CAV-Zambia Airlines Reservation System) is a modern web application for airline booking, management, and administration. Built by COM322 Group 2 in April 2025, it is designed for passengers and airline staff to provide a seamless digital experience for Zambia’s air travel market.

This system enables users to search for flights, book tickets, manage bookings, and for administrators to manage flights, schedules, users, and bookings. The platform emphasizes usability, security, and scalability.

## Project Requirements Coverage

1. **Home Page**: 5 images (JPG, PNG), auto-loading video, social media links (Facebook, Twitter, etc.), flight schedules, and text content.
2. **Our Service**: Dropdown for Domestic/International, 3+ images, video, social media links.
3. **Booking**: Name, ID/Passport number, upload/attach ID/Passport, email, phone, service type, passengers, amount, submit/book button.
4. **Contacts**: Address, Google Map, location search, search button.

## System Architecture

- **Frontend**: HTML5, CSS3, JavaScript, responsive design, AJAX, file uploads
- **Backend**: PHP, MySQL, RESTful API, Secure file handling
- **Database**: Users, Admins, Flights, Schedules, Bookings, with foreign keys and validation constraints

## User Roles & Permissions

- **Guest**: View home, services, contact
- **User**: Register/login, book flights, view dashboard, manage bookings
- **Admin**: Manage users, flights, schedules, bookings via admin dashboard

## User Journey

1. User visits Home Page, views images, video, schedules, and social links
2. Explores Services page to view Domestic/International offerings
3. Proceeds to Booking, fills form, uploads ID/Passport, submits booking
4. Receives confirmation, manages bookings in Dashboard
5. Admins log in to manage users, flights, schedules, and bookings

## Main Features

### Home Page

- Rotating carousel of 5 images
- Auto-load video section
- Social media links (Facebook, Twitter, etc.)
- Live flight schedules
- Airline news and announcements

### Services Page

- Dropdown menu for Domestic/International
- Service info cards with images and video
- Social media integration

### Booking Page

- Booking form with:
  - Name, Email, Phone
  - ID/Passport Number
  - File upload for ID/Passport
  - Service type (dropdown)
  - Number of passengers
  - Calculated amount (auto-updated)
  - Submit/Book button
- Client-side and server-side validation
- Success/error feedback

### Contact Page

- Company address
- Embedded Google Map
- Location search bar
- Contact form (optional)
- Social/contact links

### User Dashboard

- View/manage bookings
- Download confirmations
- Update profile (email, phone, password)

### Admin Dashboard

- Manage users: Add, edit, delete
- Manage flights: Add, edit, delete
- Manage schedules: Create/modify
- Manage bookings: View, confirm, cancel

## REST API Endpoints (Summary)

- `/backend/login.php` – User authentication (POST)
- `/backend/register.php` – User registration (POST)
- `/admin/manage_users.php` – CRUD users (GET, POST, PUT, DELETE)
- `/admin/manage_flights.php` – CRUD flights (GET, POST, PUT, DELETE)
- `/admin/manage_schedules.php` – CRUD schedules (GET, POST, PUT, DELETE)
- `/admin/manage_bookings.php` – CRUD bookings (GET, POST, PUT, DELETE)
- `/backend/booking/booking.php` – Booking submission (POST)

## Security & Validation

- Passwords hashed with bcrypt
- Prepared statements (PDO) for SQL injection prevention
- Input sanitization (XSS/CSRF protection)
- Secure file upload checks (type, size, extension)
- Session management for authenticated users
- Role-based access control for admin endpoints
- HTTPS recommended for deployment

## Error Handling & Validation

- Client-side validation for all forms (required fields, email/phone format, file type/size)
- Server-side validation for all API endpoints
- Custom error messages for user feedback
- Graceful handling of server/database errors
- Logging of critical errors (admin only)

## Testing & Quality Assurance

- Manual testing of all user flows (booking, registration, admin)
- Automated validation for forms (JS)
- Backend unit tests for critical functions (where applicable)
- Cross-browser and mobile responsiveness checks
- Security audit for file uploads and authentication

## Maintenance & Extensibility

- Modular code structure for easy updates
- Clear separation of frontend, backend, and admin logic
- Well-documented API endpoints and database schema
- Easy to add new service types, destinations, or admin features
- Version control (Git) recommended for tracking changes

## Credits & Acknowledgments

- Developed by COM322 Group 2
- Uses open-source libraries: Bootstrap, jQuery, Font Awesome, Google Maps API

--------------------------------
