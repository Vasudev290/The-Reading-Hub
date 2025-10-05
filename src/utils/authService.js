// src/utils/authService.js
class AuthService {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    
    // Initialize with demo admin user if no users exist
    if (this.users.length === 0) {
      const adminUser = {
        id: '1',
        name: 'Admin User',
        email: 'admin@library.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      this.users.push(adminUser);
      this.saveUsers();
    }
  }

  saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  // In your authService.js, update the register function:
register(userData) {
  const { email, password, name, role } = userData;

  // Check if user already exists
  if (this.users.find(user => user.email === email)) {
    return { success: false, error: 'User already exists' };
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password, // In real app, hash this
    name,
    role,
    createdAt: new Date().toISOString(),
    wishlist: [], // Initialize empty wishlist
    borrowedBooks: [],
    ratings: {}
  };

  this.users.push(newUser);
  this.saveUsers();

  return { success: true, user: newUser };
}

  login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser() {
    return this.currentUser;
  }

  updateUser(userId, userData) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...userData };
      this.saveUsers();
      
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser = this.users[userIndex];
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }
      
      return this.users[userIndex];
    }
    return null;
  }

  getAllUsers() {
    return this.users.filter(user => user.role !== 'admin');
  }
}

export const authService = new AuthService();