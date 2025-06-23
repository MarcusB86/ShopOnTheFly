const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../database/connection');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search, sort = 'name', order = 'asc' } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    // Add category filter
    if (category) {
      paramCount++;
      query += ` AND c.name ILIKE $${paramCount}`;
      params.push(`%${category}%`);
    }

    // Add search filter
    if (search) {
      paramCount++;
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Add sorting
    const validSortFields = ['name', 'price', 'created_at'];
    const validOrders = ['asc', 'desc'];
    const sortField = validSortFields.includes(sort) ? sort : 'name';
    const sortOrder = validOrders.includes(order.toLowerCase()) ? order.toUpperCase() : 'ASC';
    
    query += ` ORDER BY p.${sortField} ${sortOrder}`;

    const result = await pool.query(query, params);
    res.json(result.rows);

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', [
  adminAuth,
  body('name').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('price').isFloat({ min: 0 }),
  body('stockQuantity').isInt({ min: 0 }),
  body('categoryId').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, stockQuantity, categoryId, imageUrl } = req.body;

    const result = await pool.query(`
      INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `, [name, description, price, stockQuantity, categoryId, imageUrl]);

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', [
  adminAuth,
  body('name').optional().notEmpty().trim(),
  body('description').optional().notEmpty().trim(),
  body('price').optional().isFloat({ min: 0 }),
  body('stockQuantity').optional().isInt({ min: 0 }),
  body('categoryId').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, price, stockQuantity, categoryId, imageUrl } = req.body;

    // Check if product exists
    const existingProduct = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const result = await pool.query(`
      UPDATE products 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          stock_quantity = COALESCE($4, stock_quantity),
          category_id = COALESCE($5, category_id),
          image_url = COALESCE($6, image_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 
      RETURNING *
    `, [name, description, price, stockQuantity, categoryId, imageUrl, id]);

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get categories
router.get('/categories/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 