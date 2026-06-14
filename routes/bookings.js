const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'id_' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Create booking
router.post('/create', upload.single('id_passport_upload'), (req, res) => {
  if (!req.session.logged_in) {
    return res.status(401).json({ success: false, message: 'Please login to book a flight.' });
  }

  const {
    schedule_id,
    flight_number,
    service_type,
    class_type,
    num_passengers,
    amount,
    id_type,
    is_round_trip,
    return_date
  } = req.body;

  const user_id = req.session.user_id;
  const user_name = req.session.full_name;
  const id_file_path = req.file ? 'uploads/' + req.file.filename : '';

  if (!schedule_id || !flight_number || !id_file_path) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  db.run(`INSERT INTO bookings (
    user_id, name, schedule_id, flight_number, service_type, class_type, 
    num_passengers, amount, id_type, id_file_path, booking_status, is_round_trip, return_date
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    user_id, user_name, schedule_id, flight_number, service_type, class_type,
    num_passengers, amount, id_type, id_file_path, 'Pending', is_round_trip || 0, return_date || null
  ],
  function(err) {
    if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Database error during booking.' });
    }
    res.json({ success: true, booking_id: this.lastID });
  });
});

// Get user bookings
router.get('/user', (req, res) => {
  if (!req.session.logged_in) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  db.all(`
    SELECT b.*, f.origin, f.destination, fs.departure_date, fs.departure_time, fs.arrival_time
    FROM bookings b
    JOIN flight_schedules fs ON b.schedule_id = fs.schedule_id
    JOIN flights f ON fs.flight_id = f.flight_id
    WHERE b.user_id = ?
    ORDER BY b.booking_date DESC
  `, [req.session.user_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    
    const bookings = rows.map(row => ({
        ...row,
        isRoundTrip: !!row.is_round_trip,
        returnDate: row.return_date || null
    }));
    
    res.json({ success: true, bookings });
  });
});

// Track booking
router.get('/track/:booking_id', (req, res) => {
  db.get(`
    SELECT b.*, f.origin, f.destination, fs.departure_date, fs.departure_time 
    FROM bookings b
    JOIN flight_schedules fs ON b.schedule_id = fs.schedule_id
    JOIN flights f ON fs.flight_id = f.flight_id
    WHERE b.booking_id = ?
  `, [req.params.booking_id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    if (!row) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json(row);
  });
});

// Track booking by ID and Name (for manage booking)
router.post('/track-search', (req, res) => {
  const { booking_ref, name } = req.body;
  db.get(`
    SELECT b.*, f.origin, f.destination, fs.departure_date, fs.departure_time, fs.arrival_time 
    FROM bookings b
    JOIN flight_schedules fs ON b.schedule_id = fs.schedule_id
    JOIN flights f ON fs.flight_id = f.flight_id
    WHERE b.booking_id = ? AND b.name LIKE ?
  `, [booking_ref, `%${name}%`], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    if (!row) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, booking: row });
  });
});

module.exports = router;

