import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { bookService } from '../utils/bookService';
import { authService } from '../utils/authService';
import StatsCards from '../components/admin/StatsCards';
import BookManagement from '../components/admin/BookManagement';
import UserManagement from '../components/admin/UserManagement';
import RecentActivity from '../components/admin/RecentActivity';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setBooks(bookService.getAllBooks());
      setUsers(authService.getAllUsers());
      setBorrowedBooks(bookService.getAllBorrowedBooks());
      setLoading(false);
    }, 500); 
  };

  const stats = {
    totalBooks: books.length,
    totalUsers: users.length,
    borrowedBooks: borrowedBooks.length,
    outOfStock: books.filter(book => book.stock === 0).length
  };

  const tabs = [
    { id: 'overview', label: t('overview'), icon: '📊' },
    { id: 'books', label: t('booksManagement'), icon: '📚' },
    { id: 'users', label: t('usersManagement'), icon: '👥' },
    { id: 'borrowedTab', label: t('borrowedTab'), icon: '📖' }
  ];

  if (user?.role !== 'admin') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-96 p-4"
      >
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            {t('accessDenied')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('adminAccessRequired')}
          </p>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('Admin Dashboard')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('Manage Library')}
        </p>
      </motion.div>

      {/* Stats Overview */}
      <StatsCards stats={stats} />

      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {/* Mobile Tabs Dropdown */}
        <div className="md:hidden p-4">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
          >
            {tabs.map(tab => (
              <option key={tab.id} value={tab.id}>
                {tab.icon} {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:block border-b border-gray-200 dark:border-gray-600">
          <nav className="flex overflow-x-auto px-4 sm:px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <RecentActivity borrowedBooks={borrowedBooks} />
                    
                    {/* Quick Stats */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {t('Quick Status')}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            {t('Average Rating')}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {books.length > 0 
                              ? (books.reduce((sum, book) => sum + (book.rating || 0), 0) / books.length).toFixed(1)
                              : '0.0'
                            } ⭐
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            {t('Total Categories')}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {[...new Set(books.map(book => book.category))].length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            {t('Active Borrowers')}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {[...new Set(borrowedBooks.map(record => record.userId))].length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'books' && (
                <BookManagement books={books} onBooksUpdate={loadData} />
              )}

              {activeTab === 'users' && (
                <UserManagement users={users} borrowedBooks={borrowedBooks} />
              )}

              {activeTab === 'borrowedTab' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {t('borrowedBooks')}
                    </h2>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm w-fit">
                      {borrowedBooks.length} {t('books')}
                    </span>
                  </div>

                  {borrowedBooks.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="text-6xl mb-4">📚</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {t('noBorrowedBooks')}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t('noBooksCurrentlyBorrowed')}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('book')}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('user')}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('borrowedDate')}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('status')}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {borrowedBooks.map((record, index) => (
                              <motion.tr
                                key={record.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <img
                                      src={record.book.image}
                                      alt={record.book.title}
                                      className="h-12 w-12 sm:h-16 sm:w-16 rounded object-contain mr-3"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {record.book.title}
                                      </div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {record.book.author}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                  User {record.userId}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                  {new Date(record.borrowedAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                                    {t('borrowed')}
                                  </span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;