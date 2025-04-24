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
    type ENUM('Domestic', 'International') NOT NULL,
    price DECIMAL(10,2) NOT NULL
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
    flight_number VARCHAR(20) NOT NULL,
    service_type ENUM('Domestic', 'International') NOT NULL,
    class_type ENUM('Economy Class', 'Business Class') NOT NULL,
    num_passengers INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    id_type ENUM('ID', 'Passport') NOT NULL,
    id_file_path VARCHAR(255) NOT NULL,
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES flight_schedules(schedule_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_number) REFERENCES flights(flight_number) ON DELETE CASCADE
);

INSERT INTO flights (flight_number, origin, destination, type, price) VALUES
('CAV101', 'Lusaka', 'Nairobi', 'Domestic', 1500.00),
('CAV102', 'Lusaka', 'Johannesburg', 'International', 2500.00),
('CAV103', 'Lusaka', 'Kampala', 'Domestic', 1800.00),
('CAV104', 'Lusaka', 'Casablanca', 'International', 3000.00),
('CAV105', 'Lusaka', 'Accra', 'Domestic', 2200.00),
('CAV106', 'Lusaka', 'Casablanca', 'International', 3000.00),
('CAV107', 'Lusaka', 'Kampala', 'Domestic', 1800.00),
('CAV108', 'Lusaka', 'Nairobi', 'International', 2500.00),
('CAV109', 'Lusaka', 'Johannesburg', 'Domestic', 1500.00),
('CAV110', 'Lusaka', 'Casablanca', 'International', 3000.00);

INSERT INTO flight_schedules (flight_id, frequency, departure_date, departure_time, arrival_time) VALUES
(1, 'Daily', '2025-04-23', '08:00:00', '10:00:00'),
(2, 'Daily', '2025-04-23', '08:00:00', '10:00:00'),
(3, 'Daily', '2025-04-23', '08:00:00', '10:00:00'),
(4, 'Daily', '2025-04-23', '08:00:00', '10:00:00'),
(5, 'Daily', '2025-04-23', '08:00:00', '10:00:00'),
(6, 'Daily', '2025-04-23', '08:00:00', '10:00:00'),
(7, 'Daily', '2025-04-23', '08:00:00', '10:00:00'),
(8, 'Daily', '2025-04-23', '08:00:00', '10:00:00'),
(9, 'Daily', '2025-04-23', '08:00:00', '10:00:00'),
(10, 'Daily', '2025-04-23', '08:00:00', '10:00:00');