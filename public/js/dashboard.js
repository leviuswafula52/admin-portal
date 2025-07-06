// Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.currentView = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.checkAuth();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.getAttribute('href').substring(1);
                this.showView(view);
            });
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Add customer button
        document.getElementById('addCustomerBtn').addEventListener('click', () => {
            this.showModal('addCustomerModal');
        });

        // Add product button
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.showModal('addProductModal');
            this.loadCategories();
        });

        // Form submissions
        document.getElementById('customerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCustomer();
        });

        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProduct();
        });

        // Close modals when clicking outside
        document.querySelectorAll('[id$="Modal"]').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });
    }

    async checkAuth() {
        try {
            const response = await fetch('/api/admin/profile', {
                credentials: 'include'
            });
            
            if (!response.ok) {
                window.location.href = '/login';
                return;
            }

            const data = await response.json();
            this.updateAdminInfo(data.admin);
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = '/login';
        }
    }

    updateAdminInfo(admin) {
        document.getElementById('adminName').textContent = admin.name || 'Admin User';
    }

    showView(view) {
        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

        // Show selected view
        const viewElement = document.getElementById(view + 'View');
        if (viewElement) {
            viewElement.classList.remove('hidden');
        }

        // Update navigation
        const activeLink = document.querySelector(`[href="#${view}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        pageTitle.textContent = this.getPageTitle(view);

        this.currentView = view;

        // Load view-specific data
        switch (view) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'customers':
                this.loadCustomers();
                break;
            case 'products':
                this.loadProducts();
                break;
        }
    }

    getPageTitle(view) {
        const titles = {
            dashboard: 'Dashboard',
            customers: 'Customer Management',
            products: 'Product Management',
            categories: 'Category Management',
            orders: 'Order Management',
            settings: 'Settings'
        };
        return titles[view] || 'Dashboard';
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }

    async loadDashboardData() {
        try {
            const [customersRes, productsRes] = await Promise.all([
                fetch('/api/customers', { credentials: 'include' }),
                fetch('/api/products', { credentials: 'include' })
            ]);

            const customers = await customersRes.json();
            const products = await productsRes.json();

            // Update stats
            document.getElementById('totalCustomers').textContent = customers.length || 0;
            document.getElementById('totalProducts').textContent = products.length || 0;
            document.getElementById('totalOrders').textContent = '0'; // Placeholder
            document.getElementById('totalRevenue').textContent = '$0'; // Placeholder

            // Load recent data
            this.loadRecentCustomers(customers.slice(0, 5));
            this.loadRecentProducts(products.slice(0, 5));

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showNotification('Error loading dashboard data', 'error');
        }
    }

    loadRecentCustomers(customers) {
        const container = document.getElementById('recentCustomers');
        container.innerHTML = '';

        if (customers.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm">No customers yet</p>';
            return;
        }

        customers.forEach(customer => {
            const customerElement = document.createElement('div');
            customerElement.className = 'flex items-center space-x-3 p-3 bg-gray-50 rounded-lg';
            customerElement.innerHTML = `
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 font-medium text-sm">${customer.first_name?.charAt(0) || 'C'}</span>
                </div>
                <div class="flex-1">
                    <p class="font-medium text-gray-900">${customer.first_name} ${customer.last_name}</p>
                    <p class="text-sm text-gray-600">${customer.email || 'No email'}</p>
                </div>
            `;
            container.appendChild(customerElement);
        });
    }

    loadRecentProducts(products) {
        const container = document.getElementById('recentProducts');
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm">No products yet</p>';
            return;
        }

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'flex items-center space-x-3 p-3 bg-gray-50 rounded-lg';
            productElement.innerHTML = `
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span class="text-green-600 font-medium text-sm">${product.name?.charAt(0) || 'P'}</span>
                </div>
                <div class="flex-1">
                    <p class="font-medium text-gray-900">${product.name}</p>
                    <p class="text-sm text-gray-600">$${product.price || '0'}</p>
                </div>
            `;
            container.appendChild(productElement);
        });
    }

    async loadCustomers() {
        try {
            const response = await fetch('/api/customers', { credentials: 'include' });
            const customers = await response.json();
            this.renderCustomersTable(customers);
        } catch (error) {
            console.error('Error loading customers:', error);
            this.showNotification('Error loading customers', 'error');
        }
    }

    renderCustomersTable(customers) {
        const tbody = document.getElementById('customersTableBody');
        tbody.innerHTML = '';

        if (customers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-8 text-gray-500">No customers found</td>
                </tr>
            `;
            return;
        }

        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200 hover:bg-gray-50';
            row.innerHTML = `
                <td class="py-3 px-4 text-sm text-gray-900">${customer.customer_id}</td>
                <td class="py-3 px-4 text-sm text-gray-900">${customer.first_name} ${customer.last_name}</td>
                <td class="py-3 px-4 text-sm text-gray-600">${customer.email || '-'}</td>
                <td class="py-3 px-4 text-sm text-gray-600">${customer.phone || '-'}</td>
                <td class="py-3 px-4 text-sm">
                    <div class="flex space-x-2">
                        <button onclick="dashboard.editCustomer(${customer.customer_id})" class="text-blue-600 hover:text-blue-800">Edit</button>
                        <button onclick="dashboard.deleteCustomer(${customer.customer_id})" class="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async loadProducts() {
        try {
            const response = await fetch('/api/products', { credentials: 'include' });
            const products = await response.json();
            this.renderProductsTable(products);
        } catch (error) {
            console.error('Error loading products:', error);
            this.showNotification('Error loading products', 'error');
        }
    }

    renderProductsTable(products) {
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';

        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-8 text-gray-500">No products found</td>
                </tr>
            `;
            return;
        }

        products.forEach(product => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200 hover:bg-gray-50';
            row.innerHTML = `
                <td class="py-3 px-4 text-sm text-gray-900">${product.product_id}</td>
                <td class="py-3 px-4 text-sm text-gray-900">${product.name}</td>
                <td class="py-3 px-4 text-sm text-gray-600">${product.category_name || '-'}</td>
                <td class="py-3 px-4 text-sm text-gray-900">$${product.price}</td>
                <td class="py-3 px-4 text-sm text-gray-600">${product.stock_quantity}</td>
                <td class="py-3 px-4 text-sm">
                    <div class="flex space-x-2">
                        <button onclick="dashboard.editProduct(${product.product_id})" class="text-blue-600 hover:text-blue-800">Edit</button>
                        <button onclick="dashboard.deleteProduct(${product.product_id})" class="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async loadCategories() {
        try {
            const response = await fetch('/api/categories', { credentials: 'include' });
            const categories = await response.json();
            
            const select = document.getElementById('productCategory');
            select.innerHTML = '<option value="">Select Category</option>';
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category_id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async addCustomer() {
        const formData = {
            first_name: document.getElementById('customerFirstName').value,
            last_name: document.getElementById('customerLastName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            address: document.getElementById('customerAddress').value
        };

        try {
            const response = await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showNotification('Customer added successfully', 'success');
                this.closeAllModals();
                document.getElementById('customerForm').reset();
                this.loadCustomers();
                this.loadDashboardData();
            } else {
                const data = await response.json();
                this.showNotification(data.message || 'Error adding customer', 'error');
            }
        } catch (error) {
            console.error('Error adding customer:', error);
            this.showNotification('Error adding customer', 'error');
        }
    }

    async addProduct() {
        const formData = {
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            category_id: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock_quantity: parseInt(document.getElementById('productStock').value)
        };

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showNotification('Product added successfully', 'success');
                this.closeAllModals();
                document.getElementById('productForm').reset();
                this.loadProducts();
                this.loadDashboardData();
            } else {
                const data = await response.json();
                this.showNotification(data.message || 'Error adding product', 'error');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            this.showNotification('Error adding product', 'error');
        }
    }

    async deleteCustomer(customerId) {
        if (!confirm('Are you sure you want to delete this customer?')) return;

        try {
            const response = await fetch(`/api/customers/${customerId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                this.showNotification('Customer deleted successfully', 'success');
                this.loadCustomers();
                this.loadDashboardData();
            } else {
                const data = await response.json();
                this.showNotification(data.message || 'Error deleting customer', 'error');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            this.showNotification('Error deleting customer', 'error');
        }
    }

    async deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                this.showNotification('Product deleted successfully', 'success');
                this.loadProducts();
                this.loadDashboardData();
            } else {
                const data = await response.json();
                this.showNotification(data.message || 'Error deleting product', 'error');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showNotification('Error deleting product', 'error');
        }
    }

    editCustomer(customerId) {
        // Implement edit customer functionality
        this.showNotification('Edit customer functionality coming soon', 'info');
    }

    editProduct(productId) {
        // Implement edit product functionality
        this.showNotification('Edit product functionality coming soon', 'info');
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }

    closeAllModals() {
        document.querySelectorAll('[id$="Modal"]').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    async logout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                window.location.href = '/login';
            } else {
                this.showNotification('Error logging out', 'error');
            }
        } catch (error) {
            console.error('Error logging out:', error);
            this.showNotification('Error logging out', 'error');
        }
    }

    showNotification(message, type) {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm`;
        
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            info: 'bg-blue-500 text-white',
            warning: 'bg-yellow-500 text-white'
        };
        
        notification.className += ` ${colors[type] || colors.info}`;
        
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${type === 'success' ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}"></path>
                </svg>
                <span class="font-medium">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new AdminDashboard();
});