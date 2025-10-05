import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { bookService } from '../utils/bookService';
import { userService } from '../utils/userService';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      });
      
      const userBorrowedBooks = bookService.getBorrowedBooksByUser(user.id);
      setBorrowedBooks(userBorrowedBooks);
      
      const userWishlist = userService.getWishlist(user.id);
      setWishlist(userWishlist);
    }
  }, [user]);

  const handleSave = () => {
    updateProfile(formData);
    setEditMode(false);
  };

  const handleReturnBook = (borrowId) => {
    const result = bookService.returnBook(borrowId);
    if (result.success) {
      const updatedBorrowedBooks = bookService.getBorrowedBooksByUser(user.id);
      setBorrowedBooks(updatedBorrowedBooks);
    }
  };

  const handleRemoveFromWishlist = (bookId) => {
    const result = userService.removeFromWishlist(user.id, bookId);
    if (result.success) {
      const updatedWishlist = userService.getWishlist(user.id);
      setWishlist(updatedWishlist);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {t('profile')}
          </h1>
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            {editMode ? t('cancel') : t('editProfile')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('name')}
            </label>
            {editMode ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              />
            ) : (
              <p className="text-gray-900 dark:text-white text-sm sm:text-base">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('email')}
            </label>
            {editMode ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              />
            ) : (
              <p className="text-gray-900 dark:text-white text-sm sm:text-base">{user.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('role')}
            </label>
            <p className="text-gray-900 dark:text-white text-sm sm:text-base capitalize">{user.role}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('memberSince')}
            </label>
            <p className="text-gray-900 dark:text-white text-sm sm:text-base">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {editMode && (
          <div className="mt-4 sm:mt-6">
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 rounded-md transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              {t('saveChanges')}
            </button>
          </div>
        )}
      </motion.div>

      {/* Borrowed Books */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {t('borrowedBooks')} ({borrowedBooks.length})
        </h2>
        
        {borrowedBooks.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              {t('noBorrowedBooks')}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {borrowedBooks.map(record => (
              <div key={record.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg gap-3">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <img
                    src={record.book.image}
                    alt={record.book.title}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {record.book.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                      {t('by')} {record.book.author}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {t('borrowedOn')} {new Date(record.borrowedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleReturnBook(record.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-md transition-colors text-xs sm:text-sm w-full sm:w-auto"
                >
                  {t('return')}
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Wishlist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {t('wishlist')} ({wishlist.length})
        </h2>
        
        {wishlist.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <div className="text-4xl mb-3">❤️</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              {t('wishlistEmpty')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {wishlist.map(bookId => {
              const book = bookService.getBookById(bookId);
              if (!book) return null;
              
              return (
                <div key={book.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg gap-3">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                        {book.author}
                      </p>
                      <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm font-semibold">
                        ${book.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/book/${book.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors text-center flex-1"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(book.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors text-center flex-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;