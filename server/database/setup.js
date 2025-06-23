const pool = require('./connection');
const bcrypt = require('bcryptjs');

const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock_quantity INTEGER NOT NULL DEFAULT 0,
        category_id INTEGER REFERENCES categories(id),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Cart table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);

    // Orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Order items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables created successfully');

    // Insert sample data
    await insertSampleData();

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
};

const insertSampleData = async () => {
  try {
    // Insert admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT INTO users (email, password, first_name, last_name, role) VALUES
      ('admin@shoponthefly.com', $1, 'Admin', 'User', 'admin')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);

    // Insert sample customer user
    const customerPassword = await bcrypt.hash('customer123', 10);
    await pool.query(`
      INSERT INTO users (email, password, first_name, last_name, role) VALUES
      ('customer@shoponthefly.com', $1, 'John', 'Customer', 'customer')
      ON CONFLICT (email) DO NOTHING
    `, [customerPassword]);

    // Insert sample categories
    await pool.query(`
      INSERT INTO categories (name, description) VALUES
      ('Electronics', 'Electronic devices and accessories'),
      ('Clothing', 'Fashion and apparel'),
      ('Books', 'Books and literature'),
      ('Home & Garden', 'Home improvement and garden supplies')
      ON CONFLICT DO NOTHING
    `);

    // Insert sample products
    await pool.query(`
      INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES
      ('Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 99.99, 50, 1, 'https://via.placeholder.com/300x300?text=Headphones'),
      ('Smartphone', 'Latest smartphone with advanced features', 699.99, 25, 1, 'https://via.placeholder.com/300x300?text=Smartphone'),
      ('Cotton T-Shirt', 'Comfortable cotton t-shirt in various colors', 19.99, 100, 2, 'https://via.placeholder.com/300x300?text=T-Shirt'),
      ('Programming Book', 'Comprehensive guide to modern programming', 49.99, 30, 3, 'https://via.placeholder.com/300x300?text=Book'),
      ('Garden Tool Set', 'Complete set of essential garden tools', 79.99, 20, 4, 'https://via.placeholder.com/300x300?text=Garden+Tools')
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Sample data inserted successfully');
    console.log('👤 Admin user: admin@shoponthefly.com / admin123');
    console.log('👤 Customer user: customer@shoponthefly.com / customer123');

  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  }
};

// Run the setup
createTables().then(() => {
  console.log('🎉 Database setup completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Database setup failed:', error);
  process.exit(1);
}); 