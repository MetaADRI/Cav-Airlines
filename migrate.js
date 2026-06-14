const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  // Drop tables in reverse dependency order
  db.run("DROP TABLE IF EXISTS bookings");
  db.run("DROP TABLE IF EXISTS flight_schedules");
  db.run("DROP TABLE IF EXISTS flights");
  db.run("DROP TABLE IF EXISTS admins");
  db.run("DROP TABLE IF EXISTS users");

  // USERS TABLE
  db.run(`CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // ADMINS TABLE
  db.run(`CREATE TABLE admins (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  // FLIGHTS TABLE
  db.run(`CREATE TABLE flights (
    flight_id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT UNIQUE NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    type TEXT CHECK(type IN ('Domestic', 'International')) NOT NULL,
    price REAL NOT NULL
  )`);

  // FLIGHT SCHEDULES TABLE
  db.run(`CREATE TABLE flight_schedules (
    schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_id INTEGER NOT NULL,
    frequency TEXT CHECK(frequency IN ('Daily', 'Weekly', 'Monthly')) NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE
  )`);

  // BOOKINGS TABLE
  db.run(`CREATE TABLE bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    schedule_id INTEGER NOT NULL,
    flight_number TEXT NOT NULL,
    service_type TEXT CHECK(service_type IN ('Domestic', 'International')) NOT NULL,
    class_type TEXT CHECK(class_type IN ('Economy Class', 'Business Class')) NOT NULL,
    num_passengers INTEGER NOT NULL,
    amount REAL NOT NULL,
    id_type TEXT CHECK(id_type IN ('ID', 'Passport')) NOT NULL,
    id_file_path TEXT NOT NULL,
    booking_status TEXT CHECK(booking_status IN ('Pending', 'Confirmed', 'Cancelled')) DEFAULT 'Pending',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_round_trip INTEGER DEFAULT 0,
    return_date DATE DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES flight_schedules(schedule_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_number) REFERENCES flights(flight_number) ON DELETE CASCADE
  )`);

  // Insert initial flights
  const flights = [
    ['CAV101', 'Lusaka', 'Nairobi', 'Domestic', 1500.00],
    ['CAV102', 'Lusaka', 'Johannesburg', 'International', 2500.00],
    ['CAV103', 'Lusaka', 'Kampala', 'Domestic', 1800.00],
    ['CAV104', 'Lusaka', 'Casablanca', 'International', 3000.00],
    ['CAV105', 'Lusaka', 'Accra', 'Domestic', 2200.00],
    ['CAV106', 'Lusaka', 'Casablanca', 'International', 3000.00],
    ['CAV107', 'Lusaka', 'Kampala', 'Domestic', 1800.00],
    ['CAV108', 'Lusaka', 'Nairobi', 'International', 2500.00],
    ['CAV109', 'Lusaka', 'Johannesburg', 'Domestic', 1500.00],
    ['CAV110', 'Lusaka', 'Casablanca', 'International', 3000.00],
    ['CAV111', 'Lusaka', 'Ndola', 'Domestic', 3800.00]
  ];

  const stmt = db.prepare("INSERT INTO flights (flight_number, origin, destination, type, price) VALUES (?, ?, ?, ?, ?)");
  flights.forEach(f => stmt.run(f));
  stmt.finalize();

  // Insert initial schedules
  const schedules = [
    [1, 'Daily', '2025-04-27', '08:00:00', '10:00:00'],
    [2, 'Daily', '2025-04-27', '08:00:00', '10:00:00'],
    [3, 'Daily', '2025-04-27', '08:00:00', '10:00:00'],
    [4, 'Daily', '2025-04-27', '08:00:00', '10:00:00'],
    [5, 'Daily', '2025-04-27', '08:00:00', '10:00:00'],
    [6, 'Daily', '2025-04-27', '08:00:00', '10:00:00'],
    [7, 'Daily', '2025-04-27', '08:00:00', '10:00:00'],
    [8, 'Daily', '2025-04-27', '08:00:00', '10:00:00'],
    [9, 'Daily', '2025-04-27', '08:00:00', '10:00:00'],
    [10, 'Daily', '2025-04-27', '08:00:00', '10:00:00'],
    [11, 'Daily', '2025-04-27', '08:00:00', '10:00:00']
  ];

  const schedStmt = db.prepare("INSERT INTO flight_schedules (flight_id, frequency, departure_date, departure_time, arrival_time) VALUES (?, ?, ?, ?, ?)");
  schedules.forEach(s => schedStmt.run(s));
  schedStmt.finalize();

  console.log("Database migrated and seeded successfully.");
});

db.close();
