const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /products?category={categoryId}
router.get('/', async (req, res) => {
  const { category } = req.query;
  try {
    let result;
    if (category) {
      result = await db.query('SELECT * FROM products WHERE category_id = $1', [category]);
    } else {
      result = await db.query('SELECT * FROM products');
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving products:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /products/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /products
router.post('/', async (req, res) => {
  const { name, description, price, stock_quantity, category_id } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO products (id, name, description, price, stock_quantity, category_id, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [name, description, price, stock_quantity, category_id]
    );
    res.status(201).json({ message: 'Product created', product: result.rows[0] });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /products/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock_quantity, category_id } = req.body;
  try {
    const result = await db.query(
      `UPDATE products
       SET name = $1, description = $2, price = $3, stock_quantity = $4, category_id = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [name, description, price, stock_quantity, category_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated', product: result.rows[0] });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /products/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted', product: result.rows[0] });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
