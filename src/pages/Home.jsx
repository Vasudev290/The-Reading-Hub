import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { bookService } from '../utils/bookService';
import BookCard from '../components/books/BookCard';
import SearchFilters from '../components/books/SearchFilters';

const Home = () => {
  const { user } = useAuth(); //eslint-disable-line
  const { t } = useLanguage();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    const allBooks = bookService.getAllBooks();
    setBooks(allBooks);
    setFilteredBooks(allBooks);
  };

  useEffect(() => {
    let result = books;

    if (searchTerm) {
      result = bookService.searchBooks(searchTerm);
    }

    if (selectedCategory) {
      result = result.filter(book => book.category === selectedCategory);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'title':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredBooks(result);
  }, [books, searchTerm, selectedCategory, sortBy]);

  const categories = bookService.getCategories();
  const topRatedBooks = bookService.getTopRatedBooks();

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 sm:py-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl text-white mx-2 sm:mx-0"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-4">
          {t('welcomeToLibrary')}
        </h1>
        <p className="text-base sm:text-xl opacity-90 px-4">
          {t('discoverBooks')}
        </p>
      </motion.section>

      {/* Search and Filters */}
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categories={categories}
      />

      {/* Top Rated Section */}
      {!searchTerm && !selectedCategory && (
        <section className="px-2 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
            {t('topRated')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            <AnimatePresence>
              {topRatedBooks.map(book => (
                <BookCard key={book.id} book={book} onUpdate={loadBooks} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* All Books Section */}
      <section className="px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
          {searchTerm || selectedCategory ? t('searchResults') : t('allBooks')}
          <span className="text-xs sm:text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
            ({filteredBooks.length} {t('books')})
          </span>
        </h2>

        {filteredBooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400"
          >
            <div className="text-4xl sm:text-6xl mb-4">📚</div>
            <p className="text-base sm:text-lg">{t('noBooksFound')}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            <AnimatePresence>
              {filteredBooks.map(book => (
                <BookCard key={book.id} book={book} onUpdate={loadBooks} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Categories Sections */}
      {!searchTerm && !selectedCategory && categories.map(category => {
        const categoryBooks = bookService.getBooksByCategory(category);
        if (categoryBooks.length === 0) return null;

        return (
          <section key={category} className="px-2 sm:px-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
              {category} {t('books')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              <AnimatePresence>
                {categoryBooks.slice(0, 5).map(book => (
                  <BookCard key={book.id} book={book} onUpdate={loadBooks} />
                ))}
              </AnimatePresence>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Home;