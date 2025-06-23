const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../database/connection');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.quantity, c.created_at,
             p.id as product_id, p.name, p.price, p.image_url, p.stock_quantity
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `, [req.user.id]);

    const cartItems = result.rows.map(item => ({
      id: item.id,
      productId: item.product_id,
      name: item.name,
      price: parseFloat(item.price),
      imageUrl: item.image_url,
      quantity: item.quantity,
      stockQuantity: item.stock_quantity,
      total: parseFloat(item.price) * item.quantity
    }));

    const total = cartItems.reduce((sum, item) => sum + item.total, 0);

    res.json({
      items: cartItems,
      total: total,
      itemCount: cartItems.length
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add item to cart
router.post('/add', [
  auth,
  body('productId').isInt(),
  body('quantity').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Check if product exists and has enough stock
    const productResult = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Check if item already exists in cart
    const existingCartItem = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existingCartItem.rows.length > 0) {
      // Update existing cart item
      const newQuantity = existingCartItem.rows[0].quantity + quantity;
      
      if (product.stock_quantity < newQuantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      await pool.query(
        'UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3',
        [newQuantity, userId, productId]
      );
    } else {
      // Add new cart item
      await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [userId, productId, quantity]
      );
    }

    res.json({ message: 'Item added to cart successfully' });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update cart item quantity
router.put('/update', [
  auth,
  body('productId').isInt(),
  body('quantity').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Check if product exists and has enough stock
    const productResult = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Update cart item
    const result = await pool.query(
      'UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Cart updated successfully' });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart successfully' });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    res.json({ message: 'Cart cleared successfully' });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 