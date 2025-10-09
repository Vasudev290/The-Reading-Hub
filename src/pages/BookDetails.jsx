import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Navigate } from "react-router-dom";
import { borrowBook, toggleWishlist } from "../slices/authSlice";
import { borrowBookAction, addReview } from "../slices/bookSlice";
import { motion } from "framer-motion";
import ReviewForm from "../components/books/ReviewForm";
import useToast from "../hooks/useToast";

const BookDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth);
  const toast = useToast();

  const book = books.find((b) => b.id === id);
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!book) {
    return <Navigate to="/" replace />;
  }

  const isInWishlist = user?.wishlist?.includes(book.id);
  const isBorrowed = user?.borrowedBooks?.some(
    (b) => b.id === book.id && !b.returned
  );
  const userReview = book.reviews?.find((review) => review.userId === user?.id);

  const handleBorrow = () => {
    if (book.stock > 0 && !isBorrowed) {
      dispatch(borrowBookAction(book.id));
      dispatch(borrowBook(book));
    } else if (isBorrowed) {
      toast.info("You have already borrowed this book");
    } else {
      toast.error("This book is out of stock");
    }
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(book.id));
    if (isInWishlist) {
      toast.info(`Removed "${book.title}" from wishlist`);
    } else {
      toast.success(`Added "${book.title}" to wishlist`);
    }
  };

  const handleAddReview = (reviewData) => {
    const review = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      ...reviewData,
      date: new Date().toISOString().split("T")[0],
    };
    dispatch(addReview({ bookId: book.id, review }));
    setShowReviewForm(false);
    toast.success("Review added successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/3">
              <img
                src={book.image}
                alt={book.title}
                className="h-96 w-full object-cover md:h-full"
              />
            </div>

            <div className="p-8 md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {book.title}
                </h1>
                <button onClick={handleWishlist} className="text-2xl">
                  {isInWishlist ? "❤️" : "🤍"}
                </button>
              </div>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                by {book.author}
              </p>

              <div className="flex items-center mb-4">
                <span className="text-yellow-500 text-2xl">⭐</span>
                <span className="text-lg text-gray-600 dark:text-gray-300 ml-2">
                  {book.rating?.toFixed(1) || "No ratings"}
                  {book.reviews?.length > 0 &&
                    ` (${book.reviews.length} reviews)`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Category
                  </span>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {book.category}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Price
                  </span>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${book.price}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Availability
                  </span>
                  <p
                    className={`text-lg font-medium ${
                      book.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {book.stock > 0
                      ? `${book.stock} available`
                      : "Out of Stock"}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {book.description}
              </p>

              {user?.role === "user" && (
                <div className="flex space-x-4">
                  <button
                    onClick={handleBorrow}
                    disabled={book.stock === 0 || isBorrowed}
                    className={`px-6 py-3 rounded-lg font-medium ${
                      book.stock === 0 || isBorrowed
                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isBorrowed ? "Already Borrowed" : "Borrow Book"}
                  </button>

                  {!userReview && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                    >
                      Add Review
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Reviews ({book.reviews?.length || 0})
            </h3>

            {showReviewForm && (
              <ReviewForm
                onSubmit={handleAddReview}
                onCancel={() => setShowReviewForm(false)}
              />
            )}

            <div className="space-y-4">
              {book.reviews?.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {review.userName}
                    </h4>
                    <div className="flex items-center">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                        {review.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {review.comment}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {review.date}
                  </p>
                </motion.div>
              ))}

              {(!book.reviews || book.reviews.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No reviews yet. Be the first to review this book!
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookDetails;
