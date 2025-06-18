const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// POST /register
router.post('/register', async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await db.query(
      `INSERT INTO users (id, name, email, password_hash)
       VALUES (gen_random_uuid(), $1, $2, $3)
       RETURNING id, name, email, is_admin`,
      [name, email, password_hash]
    );

    const user = result.rows[0];

    // Auto-login using Passport
    req.login(user, err => {
      if (err) return next(err);
      res.json({ message: 'Login successful', user });
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
    });
  })(req, res, next);
});

// POST /logout — end user session
router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.json({ message: 'Logged out successfully' });
  });
});

// Redirect to Google login
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handle callback from Google
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true
  }),
  (req, res) => {
    // Redirect or respond after login
    res.redirect('http://localhost:3001/profile'); // Adjust frontend URL
  }
);

// GET /me — Check current session login status
app.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  } else {
    return res.status(401).json({ message: 'Not logged in' });
  }
});

module.exports = router;
