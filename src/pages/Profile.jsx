import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, returnBook } from "../slices/authSlice";
import { returnBookAction } from "../slices/bookSlice";
import { motion } from "framer-motion";
import useToast from "../hooks/useToast";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, users } = useSelector((state) => state.auth); // Move all useSelector calls to top
  const { books } = useSelector((state) => state.books);
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  if (!user) {
    return null;
  }

  // Calculate admin stats unconditionally at the top
  const adminStats =
    user.role === "admin"
      ? {
          totalBooks: books.length,
          totalUsers: users.filter((u) => u.role === "user").length,
          borrowedBooksCount: users.reduce(
            (count, u) =>
              count +
              (u.borrowedBooks?.filter((book) => !book.returned).length || 0),
            0
          ),
          outOfStockBooks: books.filter((book) => book.stock === 0).length,
        }
      : null;

  // Only show wishlist and borrowed books for regular users
  const wishlistBooks =
    user.role === "user"
      ? books.filter((book) => user.wishlist?.includes(book.id))
      : [];
  const borrowedBooks =
    user.role === "user"
      ? user.borrowedBooks?.filter((book) => !book.returned) || []
      : [];
  const returnedBooks =
    user.role === "user"
      ? user.borrowedBooks?.filter((book) => book.returned) || []
      : [];

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    dispatch(updateProfile(formData));
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleReturnBook = (bookId) => {
    dispatch(returnBook(bookId));
    dispatch(returnBookAction(bookId));

    const book = books.find((b) => b.id === bookId);
    if (book) {
      toast.success(`Successfully returned "${book.title}"`);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Profile Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Profile
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {user.role === "admin"
                    ? "Administrator Dashboard"
                    : "User Profile"}
                </p>
              </div>
              <button
                onClick={isEditing ? handleSave : handleEditToggle}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <p
                  className={`text-lg font-medium capitalize ${
                    user.role === "admin"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {user.role} {user.role === "admin" && "👑"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Member Since
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Statistics */}
          {user.role === "admin" && adminStats && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Library Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    Total Books
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {adminStats.totalBooks}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                    Total Users
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {adminStats.totalUsers}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                    Borrowed Books
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {adminStats.borrowedBooksCount}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                    Out of Stock
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {adminStats.outOfStockBooks}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Wishlist - Only for regular users */}
          {user.role === "user" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Wishlist ({wishlistBooks.length})
              </h2>

              {wishlistBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistBooks.map((book) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        by {book.author}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-2">
                        ${book.price}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Your wishlist is empty. Add some books to your wishlist!
                </p>
              )}
            </div>
          )}

          {/* Borrowed Books - Only for regular users */}
          {user.role === "user" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                My Books ({borrowedBooks.length})
              </h2>

              {borrowedBooks.length > 0 ? (
                <div className="space-y-4">
                  {borrowedBooks.map((borrowedBook) => {
                    const book = books.find((b) => b.id === borrowedBook.id);
                    if (!book) return null;

                    return (
                      <motion.div
                        key={borrowedBook.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {book.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              by {book.author}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Borrowed on{" "}
                              {new Date(
                                borrowedBook.borrowedDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleReturnBook(borrowedBook.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                          Return Book
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  You haven't borrowed any books yet
                </p>
              )}
            </div>
          )}

          {/* Returned Books History - Only for regular users */}
          {user.role === "user" && returnedBooks.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Returned Books ({returnedBooks.length})
              </h2>

              <div className="space-y-4">
                {returnedBooks.map((returnedBook) => {
                  const book = books.find((b) => b.id === returnedBook.id);
                  if (!book) return null;

                  return (
                    <div
                      key={returnedBook.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            by {book.author}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Returned on{" "}
                            {new Date(
                              returnedBook.returnedDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
