import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  users: JSON.parse(localStorage.getItem('users')) || [],
  isAuthenticated: !!localStorage.getItem('user'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register: (state, action) => {
      const newUser = {
        id: Date.now().toString(),
        ...action.payload,
        ...(action.payload.role === 'user' && {
          borrowedBooks: [],
        wishlist: [],
        })
      };
      state.users.push(newUser);
      localStorage.setItem('users', JSON.stringify(state.users));
    },
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
        
        // Update in users array
        const userIndex = state.users.findIndex(u => u.id === state.user.id);
        if (userIndex !== -1) {
          state.users[userIndex] = { ...state.users[userIndex], ...action.payload };
          localStorage.setItem('users', JSON.stringify(state.users));
        }
      }
    },
    borrowBook: (state, action) => {
      if (state.user) {
        state.user.borrowedBooks.push({
          ...action.payload,
          borrowedDate: new Date().toISOString(),
          returned: false
        });
        localStorage.setItem('user', JSON.stringify(state.user));
        
        const userIndex = state.users.findIndex(u => u.id === state.user.id);
        if (userIndex !== -1) {
          state.users[userIndex] = state.user;
          localStorage.setItem('users', JSON.stringify(state.users));
        }
      }
    },
    returnBook: (state, action) => {
      if (state.user) {
        const bookIndex = state.user.borrowedBooks.findIndex(
          book => book.id === action.payload && !book.returned
        );
        if (bookIndex !== -1) {
          state.user.borrowedBooks[bookIndex].returned = true;
          state.user.borrowedBooks[bookIndex].returnedDate = new Date().toISOString();
          localStorage.setItem('user', JSON.stringify(state.user));
          
          const userIndex = state.users.findIndex(u => u.id === state.user.id);
          if (userIndex !== -1) {
            state.users[userIndex] = state.user;
            localStorage.setItem('users', JSON.stringify(state.users));
          }
        }
      }
    },
    toggleWishlist: (state, action) => {
      if (state.user) {
        const bookId = action.payload;
        const wishlistIndex = state.user.wishlist.indexOf(bookId);
        
        if (wishlistIndex === -1) {
          state.user.wishlist.push(bookId);
        } else {
          state.user.wishlist.splice(wishlistIndex, 1);
        }
        
        localStorage.setItem('user', JSON.stringify(state.user));
        
        const userIndex = state.users.findIndex(u => u.id === state.user.id);
        if (userIndex !== -1) {
          state.users[userIndex] = state.user;
          localStorage.setItem('users', JSON.stringify(state.users));
        }
      }
    },
  },
});

export const {
  register,
  login,
  logout,
  updateProfile,
  borrowBook,
  returnBook,
  toggleWishlist,
} = authSlice.actions;

export default authSlice.reducer;