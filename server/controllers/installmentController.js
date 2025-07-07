const db = require('../config/db');

exports.getAllInstallments = async (req, res) => {
  try {
    const [installments] = await db.execute(`
      SELECT i.*, c.first_name, c.last_name, o.order_id
      FROM installments i
      LEFT JOIN customers c ON i.customer_id = c.customer_id
      LEFT JOIN orders o ON i.order_id = o.order_id
      ORDER BY i.due_date ASC
    `);
    res.json(installments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching installments' });
  }
};

exports.getInstallmentsByOrder = async (req, res) => {
  try {
    const [installments] = await db.execute(
      'SELECT * FROM installments WHERE order_id = ?',
      [req.params.orderId]
    );
    res.json(installments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching installments' });
  }
};

exports.createInstallment = async (req, res) => {
  try {
    const { order_id, customer_id, amount, due_date, status } = req.body;
    const [result] = await db.execute(
      'INSERT INTO installments (order_id, customer_id, amount, due_date, status) VALUES (?, ?, ?, ?, ?)',
      [order_id, customer_id, amount, due_date, status || 'Pending']
    );
    res.status(201).json({ message: 'Installment created', installment_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating installment' });
  }
};

exports.updateInstallment = async (req, res) => {
  try {
    const { amount, due_date, status } = req.body;
    await db.execute(
      'UPDATE installments SET amount = ?, due_date = ?, status = ? WHERE installment_id = ?',
      [amount, due_date, status, req.params.id]
    );
    res.json({ message: 'Installment updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating installment' });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    await db.execute(
      "UPDATE installments SET status = 'Paid' WHERE installment_id = ?",
      [req.params.id]
    );
    res.json({ message: 'Installment marked as paid' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking as paid' });
  }
};

exports.deleteInstallment = async (req, res) => {
  try {
    await db.execute('DELETE FROM installments WHERE installment_id = ?', [req.params.id]);
    res.json({ message: 'Installment deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting installment' });
  }
}; 