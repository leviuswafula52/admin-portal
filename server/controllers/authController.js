const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    
    // Check if admin already exists
    const [existingAdmins] = await db.execute(
      'SELECT * FROM admins WHERE email = ?',
      [email]
    );
    
    if (existingAdmins.length > 0) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert admin
    const [result] = await db.execute(
      'INSERT INTO admins (full_name, email, password_hash) VALUES (?, ?, ?)',
      [full_name, email, hashedPassword]
    );
    
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering admin' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin
    const [admins] = await db.execute(
      'SELECT * FROM admins WHERE email = ?',
      [email]
    );
    
    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const admin = admins[0];
    
    // Check password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: admin.admin_id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Update last login
    await db.execute(
      'UPDATE admins SET last_login = NOW() WHERE admin_id = ?',
      [admin.admin_id]
    );
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000 // 1 hour
    });
    
    res.json({ 
      message: 'Login successful',
      admin: {
        id: admin.admin_id,
        name: admin.full_name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
};

exports.getProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;
    
    const [admins] = await db.execute(
      'SELECT admin_id, full_name, email, created_at, last_login FROM admins WHERE admin_id = ?',
      [adminId]
    );
    
    if (admins.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    const admin = admins[0];
    
    res.json({
      admin: {
        id: admin.admin_id,
        name: admin.full_name,
        email: admin.email,
        created_at: admin.created_at,
        last_login: admin.last_login
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching admin profile' });
  }
};