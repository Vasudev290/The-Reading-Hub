class UserService {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
  }

  saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  addToWishlist(userId, bookId) {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) return false;

    const user = this.users[userIndex];
    
    // Initialize wishlist if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Check if book is already in wishlist
    if (user.wishlist.includes(bookId)) {
      return { success: false, message: 'Book already in wishlist' };
    }

    // Add to wishlist
    user.wishlist.push(bookId);
    this.saveUsers();

    // Update current user in localStorage if it's the same user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.id === userId) {
      currentUser.wishlist = user.wishlist;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    return { success: true, message: 'Book added to wishlist' };
  }

  removeFromWishlist(userId, bookId) {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) return false;

    const user = this.users[userIndex];
    
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => id !== bookId);
    this.saveUsers();

    // Update current user in localStorage if it's the same user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.id === userId) {
      currentUser.wishlist = user.wishlist;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    return { success: true, message: 'Book removed from wishlist' };
  }

  getWishlist(userId) {
    const user = this.users.find(user => user.id === userId);
    return user?.wishlist || [];
  }

  updateUserWishlist(userId, wishlist) {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) return false;

    this.users[userIndex].wishlist = wishlist;
    this.saveUsers();

    // Update current user in localStorage if it's the same user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.id === userId) {
      currentUser.wishlist = wishlist;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    return true;
  }
}

export const userService = new UserService();