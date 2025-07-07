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

        // Add category button
        document.getElementById('addCategoryBtn').addEventListener('click', () => {
            this.showModal('addCategoryModal');
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

        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCategory();
        });

        document.getElementById('editCategoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateCategory();
        });

        document.getElementById('editProductForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProduct();
        });

        // Close modals when clicking outside
        document.querySelectorAll('[id$="Modal"]').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });

        document.getElementById('issueProductBtn').addEventListener('click', () => {
            this.openIssueProductModal();
        });
        document.getElementById('issueProductForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitIssueProduct();
        });
        // Payment mode radio
        document.querySelectorAll('input[name="issuePaymentMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.getElementById('installmentFields').classList.toggle('hidden', e.target.value !== 'installments');
            });
        });

        // List Products button
        document.getElementById('listProductsBtn').addEventListener('click', () => {
            this.loadProducts();
        });

        // Update Price button
        document.getElementById('updatePriceBtn').addEventListener('click', () => {
            this.openUpdatePriceModal();
        });

        // Update Price form
        document.getElementById('updatePriceForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitUpdatePrice();
        });

        // Products sidebar collapsible menu
        const productsMenuBtn = document.getElementById('productsMenuBtn');
        const productsSubMenu = document.getElementById('productsSubMenu');
        const productsMenuChevron = document.getElementById('productsMenuChevron');
        if (productsMenuBtn && productsSubMenu && productsMenuChevron) {
            productsMenuBtn.addEventListener('click', () => {
                const isOpen = !productsSubMenu.classList.contains('hidden');
                productsSubMenu.classList.toggle('hidden');
                productsMenuChevron.classList.toggle('rotate-180', !isOpen);
            });
        }
        // Products sub-menu actions
        const sidebarListProducts = document.getElementById('sidebarListProducts');
        if (sidebarListProducts) {
            sidebarListProducts.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView('products');
            });
        }
        const sidebarAddProduct = document.getElementById('sidebarAddProduct');
        if (sidebarAddProduct) {
            sidebarAddProduct.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal('addProductModal');
                this.loadCategories();
            });
        }
        const sidebarUpdatePrice = document.getElementById('sidebarUpdatePrice');
        if (sidebarUpdatePrice) {
            sidebarUpdatePrice.addEventListener('click', (e) => {
                e.preventDefault();
                this.openUpdatePriceModal();
            });
        }

        // Preview & Print Reports button (open in-page modal)
        const previewPrintReportsBtn = document.getElementById('previewPrintReportsBtn');
        if (previewPrintReportsBtn) {
            previewPrintReportsBtn.addEventListener('click', () => {
                this.showModal('reportPreviewModal');
            });
        }
        // Report modal: filter and print logic
        const filterReportBtn = document.getElementById('filterReportBtn');
        if (filterReportBtn) {
            filterReportBtn.addEventListener('click', () => {
                const start = document.getElementById('startDate').value;
                const end = document.getElementById('endDate').value;
                const content = document.getElementById('reportContent');
                if (start && end) {
                    content.innerHTML = `<div class='text-gray-800'><strong>Report from ${start} to ${end}</strong><br><br><em>(Report data would be shown here.)</em></div>`;
                } else {
                    content.innerHTML = `<p class='text-red-500'>Please select both start and end dates.</p>`;
                }
            });
        }
        const printReportBtn = document.getElementById('printReportBtn');
        if (printReportBtn) {
            printReportBtn.addEventListener('click', () => {
                const printContents = document.getElementById('reportContent').innerHTML;
                const printWindow = window.open('', '', 'width=900,height=650');
                printWindow.document.write('<html><head><title>Print Report</title>');
                printWindow.document.write('<link rel="stylesheet" href="/css/styles.css">');
                printWindow.document.write('</head><body>');
                printWindow.document.write(printContents);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            });
        }
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
        document.getElementById('welcomeMessage').textContent = `Welcome Administrator (${admin.name || 'Admin User'})`;
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
            case 'categories':
                this.loadCategoriesTable();
                break;
            case 'orders':
                this.loadOrders();
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
            const [customersRes, productsRes, ordersRes] = await Promise.all([
                fetch('/api/customers', { credentials: 'include' }),
                fetch('/api/products', { credentials: 'include' }),
                fetch('/api/orders', { credentials: 'include' })
            ]);

            const customers = await customersRes.json();
            const products = await productsRes.json();
            const orders = await ordersRes.json();

            // Update stats
            document.getElementById('totalCustomers').textContent = customers.length || 0;
            document.getElementById('totalProducts').textContent = products.length || 0;
            document.getElementById('totalOrders').textContent = orders.length || 0;
            const totalSales = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
            document.getElementById('totalRevenue').textContent = `KSH ${totalSales.toLocaleString()}`;

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
                    <p class="text-sm text-gray-600">KSH ${product.price || '0'}</p>
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
                <td class="py-3 px-4 text-sm text-gray-900">KSH ${product.price}</td>
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

    async loadCategoriesTable() {
        try {
            const response = await fetch('/api/categories', { credentials: 'include' });
            const categories = await response.json();
            this.renderCategoriesTable(categories);
        } catch (error) {
            console.error('Error loading categories:', error);
            this.showNotification('Error loading categories', 'error');
        }
    }

    renderCategoriesTable(categories) {
        const tbody = document.getElementById('categoriesTableBody');
        tbody.innerHTML = '';

        if (categories.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-8 text-gray-500">No categories found</td>
                </tr>
            `;
            return;
        }

        categories.forEach(category => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200 hover:bg-gray-50';
            row.innerHTML = `
                <td class="py-3 px-2 sm:px-4 text-sm text-gray-900">${category.category_id}</td>
                <td class="py-3 px-2 sm:px-4 text-sm text-gray-900 font-medium">${category.name}</td>
                <td class="py-3 px-2 sm:px-4 text-sm text-gray-600 hidden md:table-cell">${category.description || '-'}</td>
                <td class="py-3 px-2 sm:px-4 text-sm text-gray-600">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ${category.products_count || 0}
                    </span>
                </td>
                <td class="py-3 px-2 sm:px-4 text-sm">
                    <div class="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
                        <button onclick="dashboard.editCategory(${category.category_id})" class="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">Edit</button>
                        <button onclick="dashboard.deleteCategory(${category.category_id})" class="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
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

    async editCustomer(customerId) {
        // Implement edit customer functionality
        this.showNotification('Edit customer functionality coming soon', 'info');
    }

    async editProduct(productId) {
        console.log('editProduct called with ID:', productId);
        try {
            const [productRes, categoriesRes] = await Promise.all([
                fetch(`/api/products/${productId}`, { credentials: 'include' }),
                fetch('/api/categories', { credentials: 'include' })
            ]);
            if (!productRes.ok) throw new Error('Failed to fetch product');
            const product = await productRes.json();
            const categories = await categoriesRes.json();
            // Fill form
            document.getElementById('editProductId').value = product.product_id;
            document.getElementById('editProductName').value = product.name;
            document.getElementById('editProductDescription').value = product.description || '';
            // Populate categories
            const select = document.getElementById('editProductCategory');
            select.innerHTML = '<option value="">Select Category</option>';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.category_id;
                option.textContent = cat.name;
                if (cat.category_id === product.category_id) option.selected = true;
                select.appendChild(option);
            });
            document.getElementById('editProductPrice').value = product.price;
            document.getElementById('editProductStock').value = product.stock_quantity;
            const modal = document.getElementById('editProductModal');
            if (!modal) {
                this.showNotification('Edit Product modal not found in HTML', 'error');
                console.error('Edit Product modal not found in HTML');
                return;
            }
            this.showModal('editProductModal');
        } catch (error) {
            console.error('Error loading product details:', error);
            this.showNotification('Error loading product details: ' + error.message, 'error');
        }
    }

    async updateProduct() {
        const productId = document.getElementById('editProductId').value;
        const formData = {
            name: document.getElementById('editProductName').value,
            description: document.getElementById('editProductDescription').value,
            category_id: document.getElementById('editProductCategory').value,
            price: parseFloat(document.getElementById('editProductPrice').value),
            stock_quantity: parseInt(document.getElementById('editProductStock').value)
        };
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                this.showNotification('Product updated successfully', 'success');
                this.closeAllModals();
                this.loadProducts();
                this.loadDashboardData();
            } else {
                const data = await response.json();
                this.showNotification(data.message || 'Error updating product', 'error');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            this.showNotification('Error updating product', 'error');
        }
    }

    async addCategory() {
        const formData = {
            name: document.getElementById('categoryName').value,
            description: document.getElementById('categoryDescription').value
        };

        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showNotification('Category added successfully', 'success');
                this.closeAllModals();
                document.getElementById('categoryForm').reset();
                this.loadCategoriesTable();
                this.loadCategories(); // Refresh product category dropdown
            } else {
                const data = await response.json();
                this.showNotification(data.message || 'Error adding category', 'error');
            }
        } catch (error) {
            console.error('Error adding category:', error);
            this.showNotification('Error adding category', 'error');
        }
    }

    async editCategory(categoryId) {
        try {
            const response = await fetch(`/api/categories/${categoryId}`, { credentials: 'include' });
            const category = await response.json();
            
            document.getElementById('editCategoryId').value = category.category_id;
            document.getElementById('editCategoryName').value = category.name;
            document.getElementById('editCategoryDescription').value = category.description || '';
            
            this.showModal('editCategoryModal');
        } catch (error) {
            console.error('Error loading category details:', error);
            this.showNotification('Error loading category details', 'error');
        }
    }

    async updateCategory() {
        const categoryId = document.getElementById('editCategoryId').value;
        const formData = {
            name: document.getElementById('editCategoryName').value,
            description: document.getElementById('editCategoryDescription').value
        };

        try {
            const response = await fetch(`/api/categories/${categoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showNotification('Category updated successfully', 'success');
                this.closeAllModals();
                this.loadCategoriesTable();
                this.loadCategories(); // Refresh product category dropdown
            } else {
                const data = await response.json();
                this.showNotification(data.message || 'Error updating category', 'error');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            this.showNotification('Error updating category', 'error');
        }
    }

    async deleteCategory(categoryId) {
        if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;

        try {
            const response = await fetch(`/api/categories/${categoryId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                this.showNotification('Category deleted successfully', 'success');
                this.loadCategoriesTable();
                this.loadCategories(); // Refresh product category dropdown
            } else {
                const data = await response.json();
                this.showNotification(data.message || 'Error deleting category', 'error');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            this.showNotification('Error deleting category', 'error');
        }
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

    async loadOrders() {
        try {
            const response = await fetch('/api/orders', { credentials: 'include' });
            const orders = await response.json();
            this.renderOrdersTable(orders);
        } catch (error) {
            console.error('Error loading orders:', error);
            this.showNotification('Error loading orders', 'error');
        }
    }

    renderOrdersTable(orders) {
        const tbody = document.getElementById('ordersTableBody');
        tbody.innerHTML = '';
        if (!orders.length) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-gray-500">No orders found</td></tr>`;
            return;
        }
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200 hover:bg-gray-50';
            row.innerHTML = `
                <td class="py-3 px-4 text-sm text-gray-900">${order.order_id}</td>
                <td class="py-3 px-4 text-sm text-gray-900">${order.first_name || ''} ${order.last_name || ''}</td>
                <td class="py-3 px-4 text-sm text-gray-900">KSH ${order.total_amount}</td>
                <td class="py-3 px-4 text-sm text-gray-600">${order.status}</td>
                <td class="py-3 px-4 text-sm text-gray-600">${new Date(order.created_at).toLocaleString()}</td>
                <td class="py-3 px-4 text-sm">
                    <!-- Actions (edit/delete) can be added here -->
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async openIssueProductModal() {
        // Populate customers
        const customerSelect = document.getElementById('issueCustomer');
        customerSelect.innerHTML = '';
        try {
            const res = await fetch('/api/customers', { credentials: 'include' });
            const customers = await res.json();
            customers.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.customer_id;
                opt.textContent = `${c.first_name} ${c.last_name}`;
                customerSelect.appendChild(opt);
            });
        } catch (e) {
            customerSelect.innerHTML = '<option value="">Error loading customers</option>';
        }
        // Populate products
        const productSelect = document.getElementById('issueProduct');
        productSelect.innerHTML = '';
        try {
            const res = await fetch('/api/products', { credentials: 'include' });
            const products = await res.json();
            products.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.product_id;
                opt.textContent = p.name;
                productSelect.appendChild(opt);
            });
        } catch (e) {
            productSelect.innerHTML = '<option value="">Error loading products</option>';
        }
        // Reset form
        document.getElementById('issueProductForm').reset();
        document.getElementById('installmentFields').classList.add('hidden');
        this.showModal('issueProductModal');
    }

    async submitIssueProduct() {
        const customer_id = document.getElementById('issueCustomer').value;
        const product_id = document.getElementById('issueProduct').value;
        const quantity = parseInt(document.getElementById('issueQuantity').value);
        const paymentMode = document.querySelector('input[name="issuePaymentMode"]:checked').value;
        // Get product price
        let product;
        try {
            const res = await fetch(`/api/products/${product_id}`, { credentials: 'include' });
            product = await res.json();
        } catch (e) {
            this.showNotification('Error fetching product price', 'error');
            return;
        }
        const total_amount = product.price * quantity;
        const items = [{ product_id, quantity, price: product.price }];
        let orderRes;
        try {
            orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ customer_id, items, total_amount, status: 'Pending' })
            });
        } catch (e) {
            this.showNotification('Error creating order', 'error');
            return;
        }
        if (!orderRes.ok) {
            const data = await orderRes.json();
            this.showNotification(data.message || 'Error creating order', 'error');
            return;
        }
        const orderData = await orderRes.json();
        // If installments, create them
        if (paymentMode === 'installments') {
            const numInstallments = parseInt(document.getElementById('issueNumInstallments').value);
            const firstDueDate = document.getElementById('issueFirstDueDate').value;
            if (!firstDueDate) {
                this.showNotification('First due date required for installments', 'error');
                return;
            }
            const amountPer = (total_amount / numInstallments).toFixed(2);
            const installments = [];
            let due = new Date(firstDueDate);
            for (let i = 0; i < numInstallments; i++) {
                installments.push({
                    order_id: orderData.order_id,
                    customer_id,
                    amount: amountPer,
                    due_date: due.toISOString().slice(0, 10),
                    status: 'Pending'
                });
                due.setMonth(due.getMonth() + 1);
            }
            for (const inst of installments) {
                await fetch('/api/installments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(inst)
                });
            }
        }
        this.showNotification('Product issued successfully', 'success');
        this.closeAllModals();
        this.loadOrders();
    }

    async openUpdatePriceModal() {
        // Show modal
        this.showModal('updatePriceModal');
        // Populate product dropdown
        const select = document.getElementById('updatePriceProduct');
        select.innerHTML = '';
        try {
            const res = await fetch('/api/products', { credentials: 'include' });
            const products = await res.json();
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} (${product.category_name || ''})`;
                select.appendChild(option);
            });
        } catch (err) {
            this.showNotification('Failed to load products', 'error');
        }
    }

    async submitUpdatePrice() {
        const productId = document.getElementById('updatePriceProduct').value;
        const newPrice = document.getElementById('updatePriceValue').value;
        if (!productId || !newPrice) return;
        try {
            const res = await fetch(`/api/products/${productId}/price`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ price: parseFloat(newPrice) })
            });
            if (!res.ok) throw new Error('Failed to update price');
            this.showNotification('Product price updated', 'success');
            this.closeAllModals();
            this.loadProducts();
        } catch (err) {
            this.showNotification('Failed to update price', 'error');
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new AdminDashboard();
});