require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  console.log('Running migration on Neon PostgreSQL...');

  // Drop tables in reverse dependency order
  await pool.query('DROP TABLE IF EXISTS bookings CASCADE');
  await pool.query('DROP TABLE IF EXISTS flight_schedules CASCADE');
  await pool.query('DROP TABLE IF EXISTS flights CASCADE');
  await pool.query('DROP TABLE IF EXISTS admins CASCADE');
  await pool.query('DROP TABLE IF EXISTS users CASCADE');

  // USERS TABLE
  await pool.query(`
    CREATE TABLE users (
      user_id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      profile_pic TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Created users table');

  // ADMINS TABLE
  await pool.query(`
    CREATE TABLE admins (
      admin_id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
  console.log('Created admins table');

  // FLIGHTS TABLE
  await pool.query(`
    CREATE TABLE flights (
      flight_id SERIAL PRIMARY KEY,
      flight_number TEXT UNIQUE NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      type TEXT CHECK(type IN ('Domestic', 'International')) NOT NULL,
      price REAL NOT NULL
    )
  `);
  console.log('Created flights table');

  // FLIGHT SCHEDULES TABLE
  await pool.query(`
    CREATE TABLE flight_schedules (
      schedule_id SERIAL PRIMARY KEY,
      flight_id INTEGER NOT NULL REFERENCES flights(flight_id) ON DELETE CASCADE,
      frequency TEXT CHECK(frequency IN ('Daily', 'Weekly', 'Monthly')) NOT NULL,
      departure_date DATE NOT NULL,
      departure_time TIME NOT NULL,
      arrival_time TIME NOT NULL
    )
  `);
  console.log('Created flight_schedules table');

  // BOOKINGS TABLE
  await pool.query(`
    CREATE TABLE bookings (
      booking_id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      schedule_id INTEGER NOT NULL REFERENCES flight_schedules(schedule_id) ON DELETE CASCADE,
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
      return_date DATE DEFAULT NULL
    )
  `);
  console.log('Created bookings table');

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
    ['CAV111', 'Lusaka', 'Ndola', 'Domestic', 3800.00],
  ];

  for (const f of flights) {
    await pool.query(
      'INSERT INTO flights (flight_number, origin, destination, type, price) VALUES ($1, $2, $3, $4, $5)',
      f
    );
  }
  console.log('Inserted flights');

  // Insert initial schedules
  for (let i = 1; i <= 11; i++) {
    await pool.query(
      'INSERT INTO flight_schedules (flight_id, frequency, departure_date, departure_time, arrival_time) VALUES ($1, $2, $3, $4, $5)',
      [i, 'Daily', '2025-04-27', '08:00:00', '10:00:00']
    );
  }
  console.log('Inserted flight schedules');

  console.log('Migration complete.');
  await pool.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
