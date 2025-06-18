const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Unauthorized' });
}

// GET /orders — all orders for the current user
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, status, total_price, shipping_address, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /orders/:orderId — full order details + items
router.get('/:orderId', ensureAuthenticated, async (req, res) => {
  const { orderId } = req.params;

  try {
    // Verify ownership
    const orderCheck = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, req.user.id]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found or access denied.' });
    }

    const order = orderCheck.rows[0];

    const itemsResult = await db.query(
      `SELECT oi.quantity, oi.price_at_time, p.name, p.description
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    res.json({
      order: {
        id: order.id,
        status: order.status,
        total_price: order.total_price,
        shipping_address: order.shipping_address,
        created_at: order.created_at,
        items: itemsResult.rows
      }
    });
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
