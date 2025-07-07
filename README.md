# Admin Portal

A modern, responsive admin portal built with Node.js, Express, and Tailwind CSS. This application provides a complete admin dashboard for managing customers, products, and categories.

## Features

- **Modern UI/UX**: Beautiful, responsive design using Tailwind CSS
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Admin Dashboard**: Comprehensive dashboard with statistics and management tools
- **Customer Management**: Add, edit, delete, and view customers
- **Product Management**: Full CRUD operations for products with category support
- **Category Management**: Organize products with categories
- **Real-time Notifications**: Toast notifications for user feedback
- **Mobile Responsive**: Works perfectly on all device sizes

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT, bcryptjs
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Security**: Helmet, CORS, Rate limiting

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=admin_portal
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here

   # Admin Registration
   ADMIN_REGISTER_KEY=your_admin_register_key

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   - Create a MySQL database named `admin_portal`
   - The application will automatically create required tables on startup

5. **Start the application**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## Usage

### Accessing the Application

1. **Login Page**: http://localhost:3000/login
2. **Register Page**: http://localhost:3000/register
3. **Dashboard**: http://localhost:3000/admin/dashboard (requires authentication)
4. **Admin Username**: admin@admin.com
2. **Admin password**: password


## 🚀 Features

- 🌈 Modern Tailwind-based UI
- 🔐 Secure JWT Authentication
- 📊 Dashboard Analytics
- 👥 Customer Management
- 📦 Product CRUD with Categories
- 🛎️ Real-time Toast Notifications
- 📱 Mobile-Responsive Design

---

## 🖼️ Screenshots

### 🔐 Login Page  
![Login Screenshot](assets/login-screenshot.png)

### 📝 Register Page  
![Register Screenshot](assets/register-screenshot.png)

### 📊 Dashboard  
![Dashboard Screenshot](assets/dashboard-screenshot.png)

### 🗂️ Category Management  
![Categories Screenshot](assets/categories.png)

---

## 🧰 Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript  
- **Backend**: Node.js, Express.js  
- **Database**: MySQL  
- **Authentication**: JWT, bcryptjs  
- **Security**: Helmet, CORS, Rate Limiting

---

## 📦 Prerequisites

- Node.js (v14 or later)
- MySQL Server
- npm or yarn

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/leviuswafula52/admin-portal.git
cd admin-portal

# Install dependencies
npm install

# Create a .env file in the root directory

## 🚀 Features
- Admin authentication
- Dynamic notifications
- Responsive glassmorphism UI


### Creating Your First Admin Account

1. Navigate to the register page
2. Fill in your details and use the `ADMIN_REGISTER_KEY` from your `.env` file
3. Submit the form to create your admin account
4. Use these credentials to log in

### Dashboard Features

- **Overview**: View statistics for customers, products, orders, and revenue
- **Customer Management**: Add, edit, and delete customer records
- **Product Management**: Manage products with categories and inventory
- **Category Management**: Organize products into categories
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Admin login
- `GET /api/auth/logout` - Admin logout
- `GET /api/auth/profile` - Get admin profile

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configured for secure cross-origin requests
- **Rate Limiting**: Protection against brute force attacks
- **Helmet**: Security headers for protection against common vulnerabilities
- **Input Validation**: Server-side validation for all inputs

## Project Structure

```
admin-portal/
├── public/                 # Static files
│   ├── index.html         # Main entry point
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   ├── dashboard.html     # Admin dashboard
│   └── js/
│       └── dashboard.js   # Dashboard functionality
├── server/                # Backend code
│   ├── app.js            # Main server file
│   ├── config/
│   │   ├── db.js         # Database configuration
│   │   └── setup.js      # Database setup
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   └── routes/           # API routes
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Development

### Adding New Features

1. **Backend**: Add controllers in `server/controllers/`
2. **Routes**: Define API routes in `server/routes/`
3. **Frontend**: Update dashboard JavaScript in `public/js/dashboard.js`
4. **Styling**: Use Tailwind CSS classes for consistent styling

### Database Schema

The application automatically creates these tables:
- `admins` - Admin user accounts
- `customers` - Customer information
- `products` - Product catalog
- `categories` - Product categories

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your MySQL credentials in `.env`
   - Ensure MySQL service is running
   - Check database exists

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Or kill the process using the port

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set in `.env`
   - Clear browser cookies if needed

### Logs

Check the console output for detailed error messages and debugging information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository. 
