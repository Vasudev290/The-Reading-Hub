import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { bookService } from '../../utils/bookService';
import { userService } from '../../utils/userService';

const BookCard = ({ book, onUpdate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { addToast } = useToast();

  const handleBorrow = async () => {
    if (!user) {
      addToast('Please login to borrow books', 'error');
      return;
    }

    const result = bookService.borrowBook(book.id, user.id);
    if (result.success) {
      addToast(`${t('bookBorrowedSuccess')}: ${book.title}`, 'success');
      onUpdate?.();
    } else {
      addToast(result.error, 'error');
    }
  };

  const handleWishlist = () => {
    if (!user) {
      addToast('Please login to add to wishlist', 'error');
      return;
    }

    if (isInWishlist) {
      // Remove from wishlist
      const result = userService.removeFromWishlist(user.id, book.id);
      if (result.success) {
        addToast(`Removed from wishlist: ${book.title}`, 'info');
        onUpdate?.();
      }
    } else {
      // Add to wishlist
      const result = userService.addToWishlist(user.id, book.id);
      if (result.success) {
        addToast(`Added to wishlist: ${book.title}`, 'success');
        onUpdate?.();
      } else {
        addToast(result.message, 'error');
      }
    }
  };

  const isInWishlist = user?.wishlist?.includes(book.id);
  const isBorrowed = user?.borrowedBooks?.some(b => b.bookId === book.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl"
    >
      <Link to={`/book/${book.id}`}>
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-32 sm:h-36 md:h-40 lg:h-48 object-contain hover:opacity-90 transition-opacity p-2"
        />
      </Link>
      
      <div className="p-3 sm:p-4">
        <Link to={`/book/${book.id}`}>
          <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-800 dark:text-white hover:text-blue-500 transition-colors line-clamp-2 min-h-[2.5rem]">
            {book.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-1 line-clamp-1">
          {t('by')} {book.author}
        </p>
        
        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <span className="text-yellow-500 font-semibold text-xs sm:text-sm">
            ⭐ {book.rating?.toFixed(1) || '0.0'}
          </span>
          <span className="text-green-600 dark:text-green-400 font-bold text-xs sm:text-sm">
            ${book.price}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <span className={`text-xs ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {book.stock > 0 ? `${book.stock} ${t('available')}` : t('outOfStock')}
          </span>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded truncate max-w-[100px]">
            {book.category}
          </span>
        </div>

        {user?.role === 'user' && (
          <div className="flex space-x-2 mt-3 sm:mt-4">
            <button
              onClick={handleBorrow}
              disabled={book.stock === 0 || isBorrowed}
              className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                book.stock === 0 || isBorrowed
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isBorrowed ? t('borrowed') : t('borrow')}
            </button>
            
            <button
              onClick={handleWishlist}
              className={`p-1.5 sm:p-2 rounded-md transition-colors text-xs sm:text-base ${
                isInWishlist
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-yellow-500 hover:text-white'
              }`}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isInWishlist ? '❤️' : '♡'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BookCard;