const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// POST /register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await db.query(
      `INSERT INTO users (id, name, email, password_hash) 
       VALUES (gen_random_uuid(), $1, $2, $3) 
       RETURNING id, name, email, created_at`,
      [name, email, password_hash]
    );

    return res.status(201).json({ message: 'User registered successfully.', user: result.rows[0] });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// POST /login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Login successful', user: { id: user.id, email: user.email, name: user.name } });
    });
  })(req, res, next);
});

// POST /logout

router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
