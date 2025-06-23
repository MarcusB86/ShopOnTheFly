const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../database/connection');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, 
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get order details
    const orderResult = await pool.query(`
      SELECT * FROM orders 
      WHERE id = $1 AND user_id = $2
    `, [id, userId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await pool.query(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [id]);

    const orderItems = itemsResult.rows.map(item => ({
      id: item.id,
      productId: item.product_id,
      name: item.name,
      imageUrl: item.image_url,
      quantity: item.quantity,
      price: parseFloat(item.price),
      total: parseFloat(item.price) * item.quantity
    }));

    res.json({
      ...order,
      items: orderItems
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create order
router.post('/', [
  auth,
  body('shippingAddress').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { shippingAddress } = req.body;
    const userId = req.user.id;

    // Get user's cart
    const cartResult = await pool.query(`
      SELECT c.quantity, p.id as product_id, p.name, p.price, p.stock_quantity
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
    `, [userId]);

    if (cartResult.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const cartItems = cartResult.rows;

    // Check stock availability
    for (const item of cartItems) {
      if (item.stock_quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${item.name}` 
        });
      }
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0);

    // Start transaction
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create order
      const orderResult = await client.query(`
        INSERT INTO orders (user_id, total_amount, shipping_address)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [userId, total, shippingAddress]);

      const order = orderResult.rows[0];

      // Create order items and update stock
      for (const item of cartItems) {
        // Insert order item
        await client.query(`
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ($1, $2, $3, $4)
        `, [order.id, item.product_id, item.quantity, item.price]);

        // Update product stock
        await client.query(`
          UPDATE products 
          SET stock_quantity = stock_quantity - $1
          WHERE id = $2
        `, [item.quantity, item.product_id]);
      }

      // Clear cart
      await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);

      await client.query('COMMIT');

      res.status(201).json({
        message: 'Order created successfully',
        orderId: order.id,
        total: order.total_amount
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order status (admin functionality could be added here)
router.put('/:id/status', [
  auth,
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const result = await pool.query(`
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND user_id = $3
      RETURNING *
    `, [status, id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully' });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 