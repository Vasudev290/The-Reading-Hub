import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addBook, updateBook, deleteBook } from '../slices/bookSlice';
import { motion } from 'framer-motion';
import useToast from '../hooks/useToast';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.books);
  const { users } = useSelector((state) => state.auth);
  const toast = useToast();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: ''
  });

  const handleAddBook = () => {
    const book = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      rating: 0
    };
    dispatch(addBook(book));
    setShowAddForm(false);
    resetForm();
        toast.success(`Book "${book.title}" added successfully`);

  };

  const handleUpdateBook = () => {
    dispatch(updateBook({
      id: editingBook.id,
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    }));
    setEditingBook(null);
    resetForm();
        toast.success(`Book "${formData.title}" updated successfully`);

  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      dispatch(deleteBook(bookId));
            toast.success(`Book "${bookId.title}" deleted successfully`);

    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      price: book.price.toString(),
      stock: book.stock.toString(),
      image: book.image,
      description: book.description
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      category: '',
      price: '',
      stock: '',
      image: '',
      description: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Calculate statistics
  const totalBooks = books.length;
  const totalUsers = users.filter(user => user.role === 'user').length;
  const borrowedBooksCount = users.reduce((count, user) => 
    count + (user.borrowedBooks?.filter(book => !book.returned).length || 0), 0
  );
  const outOfStockBooks = books.filter(book => book.stock === 0).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Total Books
              </h3>
              <p className="text-3xl font-bold text-blue-600">{totalBooks}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-green-600">{totalUsers}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Books Borrowed
              </h3>
              <p className="text-3xl font-bold text-yellow-600">{borrowedBooksCount}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Out of Stock
              </h3>
              <p className="text-3xl font-bold text-red-600">{outOfStockBooks}</p>
            </div>
          </div>

          {/* Add/Edit Book Form */}
          {(showAddForm || editingBook) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  name="author"
                  placeholder="Author"
                  value={formData.author}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock Count"
                  value={formData.stock}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="url"
                  name="image"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white mb-4"
              />
              
              <div className="flex space-x-4">
                <button
                  onClick={editingBook ? handleUpdateBook : handleAddBook}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingBook(null);
                    resetForm();
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Books Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Books Management
              </h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Add New Book
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-3 px-4">Book</th>
                    <th className="text-left py-3 px-4">Author</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Stock</th>
                    <th className="text-left py-3 px-4">Rating</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book.id} className="border-b border-gray-200 dark:border-gray-600">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {book.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {book.author}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {book.category}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        ${book.price}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          book.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {book.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {book.rating?.toFixed(1) || 'No ratings'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(book)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Users and Borrowed Books */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Users & Borrowed Books
            </h2>

            <div className="space-y-6">
              {users.filter(user => user.role === 'user').map(user => {
                const borrowedBooks = user.borrowedBooks?.filter(book => !book.returned) || [];
                
                return (
                  <div key={user.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </span>
                    </div>
                    
                    {borrowedBooks.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Currently borrowing {borrowedBooks.length} book(s):
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {borrowedBooks.map(borrowedBook => {
                            const book = books.find(b => b.id === borrowedBook.id);
                            if (!book) return null;
                            
                            return (
                              <div
                                key={borrowedBook.id}
                                className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                              >
                                <img
                                  src={book.image}
                                  alt={book.title}
                                  className="w-8 h-12 object-cover rounded"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {book.title}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Borrowed: {new Date(borrowedBook.borrowedDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">
                        No books currently borrowed
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;