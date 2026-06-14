const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all flights
router.get('/', (req, res) => {
  db.all("SELECT * FROM flights", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    res.json(rows);
  });
});

// Get flight by number
router.get('/number/:flight_number', (req, res) => {
  db.get("SELECT * FROM flights WHERE flight_number = ?", [req.params.flight_number], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    if (!row) return res.status(404).json({ success: false, message: 'Flight not found.' });
    res.json(row);
  });
});

// Get schedules for a flight
router.get('/schedules/:flight_id', (req, res) => {
  db.all("SELECT * FROM flight_schedules WHERE flight_id = ?", [req.params.flight_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    res.json(rows);
  });
});

// Get schedule ID by flight number and origin/destination (helper for booking)
router.get('/schedule-id', (req, res) => {
    const { origin, destination } = req.query;
    db.get(`
        SELECT fs.schedule_id, f.flight_number, f.price, f.type
        FROM flight_schedules fs
        JOIN flights f ON fs.flight_id = f.flight_id
        WHERE f.origin = ? AND f.destination = ?
        LIMIT 1
    `, [origin, destination], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error.' });
        if (!row) return res.status(404).json({ success: false, message: 'Schedule not found.' });
        res.json(row);
    });
});

module.exports = router;
