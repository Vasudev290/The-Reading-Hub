import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import bookReducer from '../slices/bookSlice';
import uiReducer from '../slices/uiSlice';
import toastReducer from '../slices/toastSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    ui: uiReducer,
    toast: toastReducer,
  },
});