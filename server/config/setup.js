const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  try {
    console.log('Setting up database...');

    // First, connect without specifying a database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306
    });

    // Create database if it doesn't exist
    console.log('Creating database if it doesn\'t exist...');
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database '${process.env.DB_NAME}' is ready`);

    // Close the initial connection
    await connection.end();

    // Create a new connection with the database specified
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });

    // Create admins table
    console.log('Creating admins table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        admin_id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
      )
    `);

    // Create categories table
    console.log('Creating categories table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        category_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create customers table
    console.log('Creating customers table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    console.log('Creating products table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        product_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category_id INT,
        price DECIMAL(10,2) NOT NULL,
        stock_quantity INT DEFAULT 0,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
      )
    `);

    // Insert default categories if they don't exist
    console.log('Checking for default categories...');
    const [existingCategories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    if (existingCategories[0].count === 0) {
      console.log('Inserting default categories...');
      await connection.execute(`
        INSERT INTO categories (name, description) VALUES 
        ('Electronics', 'Electronic devices and accessories'),
        ('Clothing', 'Apparel and fashion items'),
        ('Books', 'Books and publications'),
        ('Home & Garden', 'Home improvement and garden supplies')
      `);
      console.log('Default categories created successfully');
    } else {
      console.log('Default categories already exist');
    }

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase().then(() => {
    console.log('Setup complete');
    process.exit(0);
  }).catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}

module.exports = setupDatabase; 