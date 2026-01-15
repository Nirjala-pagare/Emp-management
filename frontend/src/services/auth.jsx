class AuthService {
    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    }

    // Get token from localStorage
    getToken() {
        return localStorage.getItem('token');
    }

    // Get user data from localStorage
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Get user role
    getUserRole() {
        const user = this.getUser();
        return user ? user.role : null;
    }

    // Check if user has specific role
    hasRole(role) {
        const userRole = this.getUserRole();
        return userRole === role;
    }

    // Save auth data to localStorage
    setAuthData(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    // Clear auth data from localStorage
    clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Login user
    async login(email, password) {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();
        this.setAuthData(data.token, {
            id: data._id,
            username: data.username,
            email: data.email,
            role: data.role
        });

        return data;
    }

    // Register user
    async register(userData) {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        return await response.json();
    }

    // Logout user
    logout() {
        this.clearAuthData();
        window.location.href = '/login';
    }
}

export default new AuthService();