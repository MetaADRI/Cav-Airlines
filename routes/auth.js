const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// Register
router.post('/register', (req, res) => {
  const { full_name, email, phone, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  // Check if email exists
  db.get("SELECT user_id FROM users WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    if (row) return res.status(400).json({ success: false, message: 'Email already exists.' });

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert user
    db.run("INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)",
      [full_name, email, phone, hashedPassword],
      function(err) {
        if (err) return res.status(500).json({ success: false, message: 'Database error during registration.' });

        // Auto login after registration
        req.session.user_id = this.lastID;
        req.session.full_name = full_name;
        req.session.email = email;
        req.session.logged_in = true;

        res.json({ success: true, message: 'Registration successful.' });
      }
    );
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    // Compare password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    // Create session
    req.session.user_id = user.user_id;
    req.session.full_name = user.full_name;
    req.session.email = user.email;
    req.session.logged_in = true;

    res.json({
      success: true,
      message: 'Login successful.',
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone
    });
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Check status
router.get('/status', (req, res) => {
  if (req.session.logged_in) {
    res.json({
      logged_in: true,
      user: {
        user_id: req.session.user_id,
        full_name: req.session.full_name,
        email: req.session.email
      }
    });
  } else {
    res.json({ logged_in: false });
  }
});

module.exports = router;
