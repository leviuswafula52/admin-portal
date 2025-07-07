const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await db.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.category_id`
    );
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const [products] = await db.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.category_id 
       WHERE p.product_id = ?`,
      [req.params.id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(products[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, category_id, price, stock_quantity, image_url } = req.body;
    
    // Validate required fields
    if (!name || !category_id || !price) {
      return res.status(400).json({ 
        message: 'Product name, category, and price are required' 
      });
    }
    
    // Validate price is a positive number
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ 
        message: 'Price must be a positive number' 
      });
    }
    
    // Provide default values for optional fields
    const defaultImageUrl = image_url || null;
    const defaultStockQuantity = stock_quantity || 0;
    
    const [result] = await db.execute(
      `INSERT INTO products 
       (name, description, category_id, price, stock_quantity, image_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, category_id, price, defaultStockQuantity, defaultImageUrl]
    );
    
    res.status(201).json({
      message: 'Product created successfully',
      product_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category_id, price, stock_quantity, image_url } = req.body;
    
    // Provide default values for optional fields
    const defaultImageUrl = image_url || null;
    const defaultStockQuantity = stock_quantity || 0;
    
    await db.execute(
      `UPDATE products SET 
       name = ?, description = ?, category_id = ?, 
       price = ?, stock_quantity = ?, image_url = ? 
       WHERE product_id = ?`,
      [name, description, category_id, price, defaultStockQuantity, defaultImageUrl, req.params.id]
    );
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await db.execute(
      'DELETE FROM products WHERE product_id = ?',
      [req.params.id]
    );
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

exports.updateProductPrice = async (req, res) => {
  try {
    const { price } = req.body;
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }
    await db.execute(
      'UPDATE products SET price = ? WHERE product_id = ?',
      [price, req.params.id]
    );
    res.json({ message: 'Product price updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product price' });
  }
};