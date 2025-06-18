const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to protect private routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Unauthorized' });
}

// Middleware to check admin
function ensureAdmin(req, res, next) {
  if (req.user?.is_admin) return next();
  return res.status(403).json({ message: 'Forbidden: Admins only' });
}

// GET /users (admin only)
router.get('/', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /users/:id (owner or admin)
router.get('/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const isOwner = req.user.id === id;

  if (!isOwner && !req.user.is_admin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const result = await db.query('SELECT id, name, email, phone_number, is_admin, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error retrieving user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /users/:id (owner or admin)
router.put('/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { name, phone_number } = req.body;

  const isOwner = req.user.id === id;
  if (!isOwner && !req.user.is_admin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const result = await db.query(
      `UPDATE users SET name = $1, phone_number = $2 WHERE id = $3 RETURNING id, name, email, phone_number`,
      [name, phone_number, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated', user: result.rows[0] });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
