# COM322 GROUP 2: CAVAIR File Structure Schema

## Root Directory Structure

``` 'markdown':
CAV-Zambia-Airlines/
├── admin/              # Administrative interface files
├── backend/            # Server-side PHP files
├── docs/               # Documentation files
├── frontend/           # Client-side files
└── link.txt            # Deployment link
```

## Frontend Structure

``` 'markdown':
frontend/
├── about_us.html       # About CAVAIR page
├── admin.html          # Admin login page
├── assets/             # Static assets
│   ├── css/           # Frontend CSS files
│   ├── images/        # Website images
│   └── js/            # Frontend JavaScript
├── booking.html        # Flight booking page
├── contact.html        # Contact information page
├── css/                # Frontend styles
│   ├── home.css       # Home page styles
│   ├── booking.css    # Booking page styles
│   ├── user_dashboard.css # User dashboard styles
│   └── admin.css      # Admin interface styles
├── flights_page.html   # Flights listing page
├── home.html           # Main landing page
├── js/                 # Frontend JavaScript
│   ├── home.js        # Home page functionality
│   ├── booking.js     # Booking page functionality
│   ├── user_dashboard.js # User dashboard functionality
│   └── admin.js       # Admin interface functionality
├── login.html          # User login page
├── register.html       # User registration page
├── services.html       # Services page
└── user_dashboard.html # User account dashboard
```

## Backend Structure

``` 'markdown':
backend/
├── booking/            # Booking system files
│   ├── booking.php    # Booking processing
│   ├── confirm.php    # Booking confirmation
│   └── cancel.php     # Booking cancellation
├── group2_cavair_db_setup.sql # Database schema
├── login.php          # User authentication
├── register.php       # User registration
├── uploads/           # User uploaded documents
├── user_dashboard/    # User dashboard functionality
└── utils/             # Utility functions
    ├── db_connect.php # Database connection
    └── functions.php  # Helper functions
```

## Admin Structure

``` 'markdown':
admin/
├── manage_bookings.php # Booking management
├── manage_flights.php  # Flight management
├── manage_schedules.php # Schedule management
└── manage_users.php    # User management
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
