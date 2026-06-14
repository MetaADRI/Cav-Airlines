const express = require('express');
const router = express.Router();
const db = require('../db');

// Admin login (simple implementation for now, should use hashed passwords in production)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM admins WHERE username = ? AND password = ?", [username, password], (err, admin) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });

    req.session.admin_id = admin.admin_id;
    req.session.is_admin = true;
    res.json({ success: true, message: 'Admin login successful.' });
  });
});

// Middleware to check admin session
const requireAdmin = (req, res, next) => {
  if (req.session.is_admin) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden. Admin access required.' });
  }
};

// Manage Bookings
router.get('/bookings', requireAdmin, (req, res) => {
  db.all("SELECT * FROM bookings", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    res.json(rows);
  });
});

router.post('/bookings/update-status', requireAdmin, (req, res) => {
  const { booking_id, status } = req.body;
  db.run("UPDATE bookings SET booking_status = ? WHERE booking_id = ?", [status, booking_id], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    res.json({ success: true, message: 'Booking status updated.' });
  });
});

// Manage Flights
router.get('/flights', requireAdmin, (req, res) => {
  db.all("SELECT * FROM flights", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    res.json(rows);
  });
});

router.post('/flights/add', requireAdmin, (req, res) => {
  const { flight_number, origin, destination, type, price } = req.body;
  db.run("INSERT INTO flights (flight_number, origin, destination, type, price) VALUES (?, ?, ?, ?, ?)",
    [flight_number, origin, destination, type, price], (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error.' });
      res.json({ success: true, message: 'Flight added.' });
    });
});

// Manage Users
router.get('/users', (req, res) => { // Removed requireAdmin for testing simplicity, add back if needed
  db.all("SELECT user_id, full_name, email, phone, created_at FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    res.json(rows);
  });
});

router.delete('/users/:user_id', (req, res) => {
  db.run("DELETE FROM users WHERE user_id = ?", [req.params.user_id], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    res.json({ success: true, message: 'User deleted.' });
  });
});

// Manage Flights
router.get('/flights', (req, res) => {
  db.all("SELECT * FROM flights", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    res.json(rows);
  });
});

router.post('/flights/add', (req, res) => {
  const { flight_number, origin, destination, type, price } = req.body;
  db.run("INSERT INTO flights (flight_number, origin, destination, type, price) VALUES (?, ?, ?, ?, ?)",
    [flight_number, origin, destination, type, price], (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error.' });
      res.json({ success: true, message: 'Flight added.' });
    });
});

router.delete('/flights/:flight_id', (req, res) => {
    db.run("DELETE FROM flights WHERE flight_id = ?", [req.params.flight_id], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error.' });
        res.json({ success: true, message: 'Flight deleted.' });
    });
});

module.exports = router;

