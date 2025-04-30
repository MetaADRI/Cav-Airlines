# COM322 GROUP 2: CAVAIR File Structure Schema

## File Structure Structure

``` 'markdown':
CAV-Zambia-Airlines(to send)/
├── README.md                        # Project overview and instructions
├── link.txt                         # Deployment/resource link
├── admin/
│   ├── manage_bookings.php          # Booking management API
│   ├── manage_flights.php           # Flight management API
│   ├── manage_schedules.php         # Schedule management API
│   └── manage_users.php             # User management API
│
├── backend/
│   ├── group2_cavair_db_setup.sql   # MySQL DB schema & seed data
│   ├── login.php                    # User login handler
│   ├── register.php                 # User registration handler
│   ├── uploads/                     # (empty) For uploaded ID/passport files
│   ├── booking/
│   │   ├── booking.php              # Booking submission
│   │   ├── check_email.php          # Email availability check
│   │   ├── check_username.php       # Username availability check
│   │   ├── get_flight_number.php    # Fetch flight numbers
│   │   ├── get_flight_price.php     # Fetch flight price
│   │   ├── get_schedule_id.php      # Get schedule IDs
│   │   ├── get_user_bookings.php    # List user bookings
│   │   └── track_booking.php        # Track booking status
│   ├── user_dashboard/
│   │   └── update_profile.php       # User profile update API
│   └── utils/
│       ├── auth.php                 # Authentication/session utilities
│       └── db_connect.php           # DB connection logic
│
├── docs/
│   ├── documentation.md             # System documentation
│   ├── file_schema.md               # File schema (this file)
│   ├── file_schema(TEMP).md         # Temporary/alternate file schema
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
│   │   ├── about_us.css
│   │   ├── admin.css
│   │   ├── booking.css
│   │   ├── common.css
│   │   ├── contact.css
│   │   ├── flights_page.css
│   │   ├── home.css
│   │   ├── login.css
│   │   ├── register.css
│   │   ├── services.css
│   │   └── user_dashboard.css
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
```

## Database Schema

``` 'markdown':
Database: group2_cavair_db

Tables:
1. users
   - user_id (PK)
   - full_name
   - email (UNIQUE)
   - password
   - phone
   - created_at

2. admins
   - admin_id (PK)
   - username (UNIQUE)
   - password

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
   - frequency
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
   - id_file_path
   - booking_status
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

- PHP 7.4+
- MySQL 8.0+
- PDO Extension
- GD Library for image processing

## Version Control Structure

Note: This schema provides a comprehensive overview of the file structure and relationships within the CAVAIR system. All paths are relative to the project root directory.
