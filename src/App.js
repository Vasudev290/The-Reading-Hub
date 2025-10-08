import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Toast from './components/common/Toast';
import Home from './pages/Home';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { useSelector } from 'react-redux';

const AppContent = () => {
  const { theme } = useSelector((state) => state.ui);

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Router>
          <Navbar />
          <Toast/>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book/:id"
              element={
                <ProtectedRoute>
                  <BookDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;