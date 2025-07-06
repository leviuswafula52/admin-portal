const db = require('../config/db');

exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.execute(
      'SELECT * FROM categories ORDER BY name'
    );
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const [categories] = await db.execute(
      'SELECT * FROM categories WHERE category_id = ?',
      [req.params.id]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(categories[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching category' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );
    
    res.status(201).json({
      message: 'Category created successfully',
      category_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating category' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    await db.execute(
      'UPDATE categories SET name = ?, description = ? WHERE category_id = ?',
      [name, description, req.params.id]
    );
    
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    // Check if category is used by any products
    const [products] = await db.execute(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
      [req.params.id]
    );
    
    if (products[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category that has associated products' 
      });
    }
    
    await db.execute(
      'DELETE FROM categories WHERE category_id = ?',
      [req.params.id]
    );
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting category' });
  }
}; 