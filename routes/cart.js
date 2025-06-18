const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Unauthorized' });
}

// POST /cart — Create a new cart (if not exists)
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const existing = await db.query('SELECT * FROM cart WHERE user_id = $1', [req.user.id]);

    if (existing.rows.length > 0) {
      return res.status(200).json({ message: 'Cart already exists', cart: existing.rows[0] });
    }

    const result = await db.query(
      'INSERT INTO cart (id, user_id, created_at) VALUES (gen_random_uuid(), $1, CURRENT_TIMESTAMP) RETURNING *',
      [req.user.id]
    );
    res.status(201).json({ message: 'Cart created', cart: result.rows[0] });
  } catch (err) {
    console.error('Error creating cart:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /cart/:cartId — Add or update product in cart
router.post('/:cartId', ensureAuthenticated, async (req, res) => {
  const { cartId } = req.params;
  const { product_id, quantity } = req.body;

  try {
    // Check if item already exists
    const existingItem = await db.query(
      'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, product_id]
    );

    let result;
    if (existingItem.rows.length > 0) {
      // Update quantity
      result = await db.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *',
        [quantity, cartId, product_id]
      );
    } else {
      // Insert new item
      result = await db.query(
        'INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING *',
        [cartId, product_id, quantity]
      );
    }

    res.status(200).json({ message: 'Cart updated', item: result.rows[0] });
  } catch (err) {
    console.error('Error adding item to cart:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /cart/:cartId — Retrieve all items in the cart
router.get('/:cartId', ensureAuthenticated, async (req, res) => {
  const { cartId } = req.params;

  try {
    // Check ownership
    const cartCheck = await db.query('SELECT * FROM cart WHERE id = $1 AND user_id = $2', [cartId, req.user.id]);
    if (cartCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Access denied to cart' });
    }

    const items = await db.query(
      `SELECT ci.id, ci.quantity, p.name, p.price, p.description 
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    res.json({ cartId, items: items.rows });
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /cart/:cartId/checkout — Simulate checkout
router.post('/:cartId/checkout', ensureAuthenticated, async (req, res) => {
  const { cartId } = req.params;
  const { shipping_address } = req.body;

  try {
    // Validate cart belongs to user
    const cartRes = await db.query('SELECT * FROM cart WHERE id = $1 AND user_id = $2', [cartId, req.user.id]);
    if (cartRes.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found or access denied.' });
    }

    // Get cart items
    const cartItemsRes = await db.query(
      `SELECT ci.product_id, ci.quantity, p.price
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );
    const items = cartItemsRes.rows;
    if (items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    // Calculate total price
    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }

    // Simulate payment success
    const paymentSuccess = true;
    if (!paymentSuccess) {
      return res.status(402).json({ message: 'Payment failed.' });
    }

    // Create order
    const orderRes = await db.query(
      `INSERT INTO orders (id, user_id, status, total_price, shipping_address, created_at)
       VALUES (gen_random_uuid(), $1, 'pending', $2, $3, CURRENT_TIMESTAMP)
       RETURNING id`,
      [req.user.id, total, shipping_address]
    );
    const orderId = orderRes.rows[0].id;

    // Insert order items
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (id, order_id, product_id, quantity, price_at_time)
         VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Clear cart (optional)
    await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
