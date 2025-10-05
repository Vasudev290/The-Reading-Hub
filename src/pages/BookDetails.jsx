import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { bookService } from '../utils/bookService';
import { userService } from '../utils/userService';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { addToast } = useToast();
  
  const [book, setBook] = useState(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookData = bookService.getBookById(id);
    if (bookData) {
      setBook(bookData);
    } else {
      addToast(t('bookNotFound'), 'error');
      navigate('/');
    }
    setLoading(false);
  }, [id, navigate, addToast, t]);

  const handleBorrow = () => {
    if (!user) {
      addToast('Please login to borrow books', 'error');
      navigate('/login');
      return;
    }

    const result = bookService.borrowBook(book.id, user.id);
    if (result.success) {
      const updatedBook = bookService.getBookById(id);
      setBook(updatedBook);
      addToast(`${t('bookBorrowedSuccess')}: ${book.title}`, 'success');
    } else {
      addToast(result.error, 'error');
    }
  };

  const handleAddReview = () => {
    if (!user) {
      addToast('Please login to add reviews', 'error');
      navigate('/login');
      return;
    }

    if (!review.trim()) {
      addToast(t('reviewRequired'), 'error');
      return;
    }

    bookService.addReview(book.id, user.id, review, rating);
    const updatedBook = bookService.getBookById(id);
    setBook(updatedBook);
    setReview('');
    setRating(5);
    addToast('Review submitted successfully!', 'success');
  };

  const handleAddToWishlist = () => {
    if (!user) {
      addToast('Please login to add to wishlist', 'error');
      navigate('/login');
      return;
    }

    const userWishlist = userService.getWishlist(user.id);
    const isInWishlist = userWishlist.includes(book.id);

    if (isInWishlist) {
      const result = userService.removeFromWishlist(user.id, book.id);
      if (result.success) {
        addToast(`Removed from wishlist: ${book.title}`, 'info');
      } else {
        addToast('Failed to remove from wishlist', 'error');
      }
    } else {
      const result = userService.addToWishlist(user.id, book.id);
      if (result.success) {
        addToast(`Added to wishlist: ${book.title}`, 'success');
      } else {
        addToast(result.message, 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex justify-center items-center h-64 p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('bookNotFound')}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const userReview = book.reviews?.find(rev => rev.userId === user?.id);
  const userWishlist = userService.getWishlist(user?.id);
  const isInWishlist = userWishlist.includes(book.id);
  const isBorrowed = user?.borrowedBooks?.some(b => b.bookId === book.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Book Image */}
        <div className="flex justify-center">
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            src={book.image}
            alt={book.title}
            className="w-full max-w-sm lg:max-w-md h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Book Details */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {book.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mt-2">
              {t('by')} {book.author}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center">
              <span className="text-yellow-500 text-xl sm:text-2xl">⭐</span>
              <span className="ml-2 text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
                {book.rating?.toFixed(1) || '0.0'}
              </span>
              <span className="ml-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                ({book.reviews?.length || 0} {t('reviews')})
              </span>
            </div>
            <span className="text-green-600 dark:text-green-400 text-xl sm:text-2xl font-bold">
              ${book.price}
            </span>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs sm:text-sm">
              {book.category}
            </span>
          </div>

          <div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              {book.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className={`text-base sm:text-lg font-semibold ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {book.stock > 0 ? `${book.stock} ${t('available')}` : t('outOfStock')}
              </span>
            </div>

            {user?.role === 'user' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToWishlist}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 sm:px-6 sm:py-2 rounded-lg transition-colors ${
                    isInWishlist
                      ? 'bg-yellow-500 text-white'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
                >
                  <span className="text-sm">{isInWishlist ? '❤️' : '♡'}</span>
                  <span className="text-sm sm:text-base">
                    {isInWishlist ? 'In Wishlist' : t('addToWishlist')}
                  </span>
                </button>
                <button
                  onClick={handleBorrow}
                  disabled={book.stock === 0 || isBorrowed}
                  className={`px-4 py-2 sm:px-6 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
                    book.stock === 0 || isBorrowed
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isBorrowed ? t('borrowed') : t('borrow')}
                </button>
              </div>
            )}
          </div>

          {/* Review Section */}
          {user?.role === 'user' && !userReview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {t('addReview')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('rating')}
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`text-xl sm:text-2xl transition-transform ${
                          rating >= num 
                            ? 'text-yellow-500 scale-110' 
                            : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                        }`}
                      >
                        ⭐
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {rating} {t('stars')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('review')}
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                    placeholder={t('writeYourReview')}
                  />
                </div>
                <button
                  onClick={handleAddReview}
                  disabled={!review.trim()}
                  className={`px-4 py-2 sm:px-6 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
                    !review.trim()
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {t('submitReview')}
                </button>
              </div>
            </motion.div>
          )}

          {/* User's Review */}
          {userReview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg"
            >
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                Your Review
              </h4>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-yellow-500">⭐ {userReview.rating}.0</span>
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {new Date(userReview.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-sm sm:text-base">{userReview.review}</p>
            </motion.div>
          )}

          {/* Reviews List */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {t('reviews')} ({book.reviews?.length || 0})
            </h3>
            <div className="space-y-4">
              {book.reviews
                ?.filter(review => !user || review.userId !== user.id)
                .map(review => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      User {review.userId}
                    </span>
                    <span className="text-yellow-500">⭐ {review.rating}.0</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{review.review}</p>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </motion.div>
              ))}
              {(!book.reviews || book.reviews.length === 0) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                    {t('noReviews')}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Be the first to review this book!
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookDetails;