document.addEventListener('DOMContentLoaded', () => {
  const authContainer = document.getElementById('authContainer');
  
  // Show login form by default
  renderLoginForm();
  
  // Switch between login and register forms
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('switch-form')) {
      e.preventDefault();
      if (e.target.textContent === 'Register') {
        renderRegisterForm();
      } else {
        renderLoginForm();
      }
    }
  });
  
  // Handle form submissions
  authContainer.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (e.target.id === 'loginForm') {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Successful login - redirect to dashboard
          window.location.href = '/dashboard.html';
        } else {
          showNotification(data.message || 'Login failed', 'error');
        }
      } catch (error) {
        showNotification('Network error', 'error');
        console.error('Login error:', error);
      }
    }
    
    if (e.target.id === 'registerForm') {
      const formData = {
        full_name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value
      };
      
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
          showNotification(data.message || 'Registration successful', 'success');
          renderLoginForm();
        } else {
          showNotification(data.message || 'Registration failed', 'error');
        }
      } catch (error) {
        showNotification('Network error', 'error');
        console.error('Registration error:', error);
      }
    }
  });
});

function renderLoginForm() {
  document.getElementById('authContainer').innerHTML = `
    <div class="auth-card">
      <div class="auth-header">
        <h2>Admin Login</h2>
        <p>Access your administrator dashboard</p>
      </div>
      
      <form id="loginForm" class="auth-form">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input type="email" id="login-email" placeholder="admin@example.com" required>
        </div>
        
        <div class="form-group">
          <label for="login-password">Password</label>
          <input type="password" id="login-password" placeholder="••••••••" required>
        </div>
        
        <div class="form-group remember">
          <input type="checkbox" id="remember-me">
          <label for="remember-me">Remember me</label>
        </div>
        
        <button type="submit" class="auth-btn">Login</button>
        <a href="#" class="forgot-password">Forgot password?</a>
      </form>
      
      <div class="auth-footer">
        <p>Don't have an account? <a href="#" class="switch-form">Register</a></p>
      </div>
    </div>
  `;
}

function renderRegisterForm() {
  document.getElementById('authContainer').innerHTML = `
    <div class="auth-card">
      <div class="auth-header">
        <h2>Admin Registration</h2>
        <p>Create your administrator account</p>
      </div>
      
      <form id="registerForm" class="auth-form">
        <div class="form-group">
          <label for="reg-name">Full Name</label>
          <input type="text" id="reg-name" placeholder="John Doe" required>
        </div>
        
        <div class="form-group">
          <label for="reg-email">Email</label>
          <input type="email" id="reg-email" placeholder="admin@example.com" required>
        </div>
        
        <div class="form-group">
          <label for="reg-password">Password</label>
          <input type="password" id="reg-password" placeholder="••••••••" required>
          <div class="password-strength"></div>
        </div>
        
        <div class="form-group">
          <label for="reg-confirm">Confirm Password</label>
          <input type="password" id="reg-confirm" placeholder="••••••••" required>
        </div>
        
        <button type="submit" class="auth-btn">Register</button>
      </form>
      
      <div class="auth-footer">
        <p>Already have an account? <a href="#" class="switch-form">Login</a></p>
      </div>
    </div>
  `;
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}