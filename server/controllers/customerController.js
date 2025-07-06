const db = require('../config/db');

exports.getAllCustomers = async (req, res) => {
  try {
    const [customers] = await db.execute(
      'SELECT * FROM customers ORDER BY customer_id DESC'
    );
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching customers' });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const [customers] = await db.execute(
      'SELECT * FROM customers WHERE customer_id = ?',
      [req.params.id]
    );
    
    if (customers.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customers[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching customer' });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, address } = req.body;
    
    const [result] = await db.execute(
      `INSERT INTO customers 
       (first_name, last_name, email, phone, address) 
       VALUES (?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone, address]
    );
    
    res.status(201).json({
      message: 'Customer created successfully',
      customer_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating customer' });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, address } = req.body;
    
    await db.execute(
      `UPDATE customers SET 
       first_name = ?, last_name = ?, email = ?, 
       phone = ?, address = ? 
       WHERE customer_id = ?`,
      [first_name, last_name, email, phone, address, req.params.id]
    );
    
    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating customer' });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    await db.execute(
      'DELETE FROM customers WHERE customer_id = ?',
      [req.params.id]
    );
    
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting customer' });
  }
};