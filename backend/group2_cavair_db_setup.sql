DROP DATABASE IF EXISTS group2_cavair_db;  
CREATE DATABASE IF NOT EXISTS group2_cavair_db;
USE group2_cavair_db;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS flight_schedules;
DROP TABLE IF EXISTS flights;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS users;

-- USERS TABLE
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ADMINS TABLE
CREATE TABLE admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- FLIGHTS TABLE
CREATE TABLE flights (
    flight_id INT PRIMARY KEY AUTO_INCREMENT,
    flight_number VARCHAR(20) UNIQUE NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    type ENUM('Domestic', 'International') NOT NULL
);

-- FLIGHT SCHEDULES TABLE
CREATE TABLE flight_schedules (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    flight_id INT NOT NULL,
    frequency ENUM('Daily', 'Weekly', 'Monthly') NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE
);

-- BOOKINGS TABLE
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    schedule_id INT NOT NULL,
    service_type ENUM('Domestic', 'International') NOT NULL,
    num_passengers INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    id_type ENUM('ID', 'Passport') NOT NULL,
    id_file_path VARCHAR(255) NOT NULL,
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES flight_schedules(schedule_id) ON DELETE CASCADE
);
