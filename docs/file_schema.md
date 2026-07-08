# COM322 GROUP 2: CAVAIR File Structure Schema

## File Structure Structure

``` 'markdown':
CAV-Zambia-Airlines/
├── README.md                        # Project overview and instructions
├── package.json                     # Node.js dependencies and scripts
├── server.js                        # Express server entry point
├── db.js                            # SQLite database connection
├── migrate.js                       # Database migration and seeding script
├── database.sqlite                  # SQLite database file (generated)
│
├── routes/                          # Express API routes
│   ├── auth.js                      # Authentication routes (login, register)
│   ├── bookings.js                  # Booking management routes
│   ├── flights.js                   # Flight and schedule routes
│   └── admin.js                     # Admin management routes
│
├── docs/
│   ├── documentation.md             # System documentation
│   ├── file_schema.md               # File schema (this file)
│   ├── requirements.txt             # Requirements/dependencies
│   ├── user_reference_manual.md     # User manual
│   └── ui-ux_design/
│       └── ... UI/UX PNG images
│
├── frontend/
│   ├── about_us.html                # About page
│   ├── admin.html                   # Admin login page
│   ├── booking.html                 # Booking form page
│   ├── contact.html                 # Contact information page
│   ├── home.html                    # Main landing page
│   ├── login.html                   # User login page
│   ├── register.html                # User registration page
│   ├── services.html                # Services page
│   ├── user_dashboard.html          # User dashboard
│   ├── assets/
│   │   ├── icons/                   # PNG/SVG icon files (UI icons)
│   │   ├── images/
│   │   │   ├── About-Us-Page/
│   │   │   ├── Home-Page/
│   │   │   ├── Login-Register-Pages/
│   │   │   ├── Services-Page/
│   │   │   └── Cavair_Logo.png
│   │   └── videos/
│   │       ├── Emirates_ad.mp4
│   │       └── Qatar_Airways_ad.mp4
│   │
│   ├── css/
│   │   ├── ... CSS files
│   │
│   └── js/
│       ├── about_us.js
│       ├── admin.js
│       ├── booking-ajax.js
│       ├── booking.js
│       ├── contact.js
│       ├── flights_page.js
│       ├── header-auth.js
│       ├── home.js
│       ├── login.js
│       ├── register.js
│       ├── services.js
│       ├── translate.js
│       └── user_dashboard.js
│
└── uploads/                         # For uploaded ID/passport files
```

## Database Schema (SQLite)

``` 'markdown':
Tables:
1. users
   - user_id (PK)
   - full_name
   - email (UNIQUE)
   - password (hashed)
   - phone
   - created_at

2. admins
   - admin_id (PK)
   - username (UNIQUE)
   - password (hashed)

3. flights
   - flight_id (PK)
   - flight_number (UNIQUE)
   - origin
   - destination
   - type (Domestic/International)
   - price

4. flight_schedules
   - schedule_id (PK)
   - flight_id (FK)
   - frequency (Daily, Weekly, Monthly)
   - departure_date
   - departure_time
   - arrival_time

5. bookings
   - booking_id (PK)
   - user_id (FK)
   - schedule_id (FK)
   - flight_number (FK)
   - service_type
   - class_type
   - num_passengers
   - amount
   - id_type (ID/Passport)
   - id_file_path
   - booking_status (Pending, Confirmed, Cancelled)
   - booking_date
   - is_round_trip
   - return_date
```

## File Dependencies

### Frontend Dependencies

- Google Maps API
- Font Awesome
- Custom CSS and JavaScript

### Backend Dependencies

- Node.js & Express
- SQLite3
- bcryptjs (for password hashing)
- multer (for file uploads)
- express-session (for session management)

## Version Control Structure

Note: This schema provides a comprehensive overview of the file structure and relationships within the CAVAIR system. All paths are relative to the project root directory.
