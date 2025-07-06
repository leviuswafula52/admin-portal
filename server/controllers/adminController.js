const db = require('../config/db');

exports.getAdminProfile = async (req, res) => {
  try {
    const [admin] = await db.execute(
      'SELECT admin_id, full_name, email, created_at, last_login FROM admins WHERE admin_id = ?',
      [req.admin.id]
    );
    
    if (admin.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json(admin[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching admin profile' });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const { full_name, email } = req.body;
    
    await db.execute(
      'UPDATE admins SET full_name = ?, email = ? WHERE admin_id = ?',
      [full_name, email, req.admin.id]
    );
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating admin profile' });
  }
};