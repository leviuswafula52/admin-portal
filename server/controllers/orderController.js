const db = require('../config/db');

exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT o.*, c.first_name, c.last_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE order_id = ?',
      [req.params.id]
    );
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const [items] = await db.execute(
      `SELECT oi.*, p.name as product_name FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );
    res.json({ ...orders[0], items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

exports.createOrder = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { customer_id, items, total_amount, status } = req.body;
    await conn.beginTransaction();
    const [orderResult] = await conn.execute(
      'INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?)',
      [customer_id, total_amount, status || 'Pending']
    );
    const orderId = orderResult.insertId;
    for (const item of items) {
      await conn.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }
    await conn.commit();
    res.status(201).json({ message: 'Order created', order_id: orderId });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error creating order' });
  } finally {
    conn.release();
  }
};

exports.updateOrder = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { customer_id, items, total_amount, status } = req.body;
    const orderId = req.params.id;
    await conn.beginTransaction();
    await conn.execute(
      'UPDATE orders SET customer_id = ?, total_amount = ?, status = ? WHERE order_id = ?',
      [customer_id, total_amount, status, orderId]
    );
    await conn.execute('DELETE FROM order_items WHERE order_id = ?', [orderId]);
    for (const item of items) {
      await conn.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }
    await conn.commit();
    res.json({ message: 'Order updated' });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error updating order' });
  } finally {
    conn.release();
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await db.execute('DELETE FROM orders WHERE order_id = ?', [req.params.id]);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting order' });
  }
}; 