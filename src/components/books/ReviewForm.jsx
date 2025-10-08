import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ReviewForm = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit({ rating, comment: comment.trim() });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4"
    >
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
        Add Your Review
      </h4>
      
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-3">
          <span className="text-sm text-gray-700 dark:text-gray-300 mr-3">Rating:</span>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl focus:outline-none"
            >
              {star <= rating ? '⭐' : '☆'}
            </button>
          ))}
        </div>
        
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here..."
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white mb-3"
          required
        />
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Submit Review
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ReviewForm;