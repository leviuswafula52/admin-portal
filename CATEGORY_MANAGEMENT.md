# Category Management

## Overview
The Category Management system allows administrators to create, view, edit, and delete product categories. This feature is fully integrated with the existing admin portal and includes mobile-responsive design.

## Features

### 1. Category List View
- Displays all categories in a responsive table
- Shows category ID, name, description, and product count
- Mobile-optimized with collapsible description column
- Product count displayed as a styled badge

### 2. Add Category
- Modal form for creating new categories
- Required fields: Category Name
- Optional fields: Description
- Form validation and error handling
- Success notifications

### 3. Edit Category
- Modal form for updating existing categories
- Pre-populated with current category data
- Real-time updates without page refresh
- Validation and error handling

### 4. Delete Category
- Confirmation dialog before deletion
- Prevents deletion if category has associated products
- Success/error notifications
- Automatic table refresh

### 5. Mobile Responsiveness
- Responsive table layout
- Collapsible columns on mobile devices
- Touch-friendly buttons and forms
- Optimized modal dialogs

## Technical Implementation

### Backend (Node.js/Express)
- **Controller**: `server/controllers/categoryController.js`
- **Routes**: `server/routes/categoryRoutes.js`
- **Database**: MySQL with categories table
- **API Endpoints**:
  - `GET /api/categories` - Get all categories with product counts
  - `GET /api/categories/:id` - Get specific category
  - `POST /api/categories` - Create new category
  - `PUT /api/categories/:id` - Update category
  - `DELETE /api/categories/:id` - Delete category

### Frontend (Vanilla JavaScript)
- **Main File**: `public/js/dashboard.js`
- **HTML**: Integrated into `public/dashboard.html`
- **Styling**: Tailwind CSS with mobile-first approach

### Database Schema
```sql
CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Usage

### Accessing Category Management
1. Log in to the admin portal
2. Click on "Categories" in the sidebar navigation
3. The category management interface will load

### Adding a Category
1. Click the "Add Category" button
2. Fill in the category name (required)
3. Optionally add a description
4. Click "Save Category"

### Editing a Category
1. Click the "Edit" button next to any category
2. Modify the name and/or description
3. Click "Update Category"

### Deleting a Category
1. Click the "Delete" button next to any category
2. Confirm the deletion in the dialog
3. Note: Categories with associated products cannot be deleted

## Integration

### Product Management
- Categories are automatically loaded in the product creation form
- Product-category relationships are maintained
- Category deletion is prevented if products exist

### Dashboard Integration
- Category count affects dashboard statistics
- Recent categories may be displayed in dashboard widgets

## Security
- All category routes require authentication
- Input validation and sanitization
- SQL injection prevention through parameterized queries
- XSS protection through proper output encoding

## Error Handling
- Network error notifications
- Form validation errors
- Database constraint violations
- User-friendly error messages

## Future Enhancements
- Category image upload
- Category hierarchy (parent-child relationships)
- Bulk category operations
- Category analytics and reporting
- Category-specific product templates 