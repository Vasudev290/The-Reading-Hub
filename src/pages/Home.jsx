import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import BookCard from '../components/books/BookCard';
import SearchFilters from '../components/books/SearchFilters';

const Home = () => {
  const { books, filters, sortBy } = useSelector((state) => state.books);

  // Filter books with proper logic
  const filteredBooks = books.filter(book => {
    const matchesSearch = !filters.search || 
      book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      book.author.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = !filters.category || book.category === filters.category;
    const matchesPrice = book.price <= filters.maxPrice;
    
    const matchesAvailability = 
      filters.availability === 'all' || 
      (filters.availability === 'available' && book.stock > 0) ||
      (filters.availability === 'outOfStock' && book.stock === 0);

    return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
  });

  // Sort books with proper logic
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'titleDesc':
        return b.title.localeCompare(a.title);
      case 'price':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'rating':
        return (a.rating || 0) - (b.rating || 0);
      case 'ratingDesc':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  // Get top rated books
  const topRatedBooks = [...books]
    .filter(book => book.rating && book.rating > 0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  // Get categories
  const categories = [...new Set(books.map(book => book.category))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to BookLibrary
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover your next favorite book from our extensive collection
          </p>
        </motion.div>

        {/* Search and Filters */}
        <SearchFilters />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {sortedBooks.length} of {books.length} books
          </p>
        </div>

        {/* Books Grid */}
        {sortedBooks.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
          >
            {sortedBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No books found matching your filters. Try adjusting your search criteria.
            </p>
          </motion.div>
        )}

        {/* Top Rated Section */}
        {topRatedBooks.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Top Rated Books
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {topRatedBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* Categories Sections */}
        {categories.map(category => {
          const categoryBooks = books.filter(book => book.category === category).slice(0, 4);
          if (categoryBooks.length === 0) return null;

          return (
            <section key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {category} Books
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Home;