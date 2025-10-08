import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { borrowBook, toggleWishlist } from '../../slices/authSlice';
import { borrowBookAction } from '../../slices/bookSlice';
import { motion } from 'framer-motion';
import useToast from '../../hooks/useToast';

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Safe check for wishlist and borrowedBooks
  const isInWishlist = user?.wishlist?.includes?.(book.id) || false;
  const isBorrowed = user?.borrowedBooks?.some?.(b => b.id === book.id && !b.returned) || false;
  
  const toast = useToast();

  const handleBorrow = () => {
    if (!user) {
      toast.error('Please login to borrow books');
      return;
    }

    if (user.role !== 'user') {
      toast.error('Only regular users can borrow books');
      return;
    }

    if (book.stock > 0 && !isBorrowed) {
      dispatch(borrowBookAction(book.id));
      dispatch(borrowBook(book));
      toast.success(`Successfully borrowed "${book.title}"`);
    } else if (isBorrowed) {
      toast.info('You have already borrowed this book');
    } else {
      toast.error('This book is out of stock');
    }
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error('Please login to manage wishlist');
      return;
    }

    if (user.role !== 'user') {
      toast.info('Wishlist is only available for regular users');
      return;
    }

    dispatch(toggleWishlist(book.id));
    if (isInWishlist) {
      toast.info(`Removed "${book.title}" from wishlist`);
    } else {
      toast.success(`Added "${book.title}" to wishlist`);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <img
        src={book.image}
        alt={book.title}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <Link to={`/book/${book.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
            {book.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
          by {book.author}
        </p>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {book.category}
          </span>
          <div className="flex items-center">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
              {book.rating?.toFixed(1) || 'No ratings'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ${book.price}
          </span>
          <span className={`text-sm font-medium ${
            book.stock > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {book.stock > 0 ? `${book.stock} available` : 'Out of Stock'}
          </span>
        </div>

        <div className="flex space-x-2">
          {user?.role === 'user' && (
            <button
              onClick={handleBorrow}
              disabled={book.stock === 0 || isBorrowed}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium ${
                book.stock === 0 || isBorrowed
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isBorrowed ? 'Borrowed' : 'Borrow'}
            </button>
          )}
          
          {user && (
            <button
              onClick={handleWishlist}
              className={`p-2 rounded ${
                user.role === 'user' 
                  ? (isInWishlist
                      ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300')
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              }`}
              disabled={user.role !== 'user'}
              title={user.role !== 'user' ? 'Wishlist available only for regular users' : ''}
            >
              {user.role === 'user' ? (isInWishlist ? '❤️' : '🤍') : '📋'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;