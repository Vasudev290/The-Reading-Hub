import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, setSortBy } from '../../slices/bookSlice';

const SearchFilters = () => {
  const dispatch = useDispatch();
  const { filters, sortBy, books } = useSelector((state) => state.books);

  const categories = [...new Set(books.map(book => book.category))];
  const maxPrice = Math.max(...books.map(book => book.price), 100);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleSortChange = (value) => {
    dispatch(setSortBy(value));
  };

  const clearFilters = () => {
    dispatch(setFilters({
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: maxPrice,
      availability: 'all'
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters & Search
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search books or authors..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Price: ${filters.maxPrice}
          </label>
          <input
            type="range"
            min="0"
            max={maxPrice}
            step="1"
            className="w-full"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>$0</span>
            <span>${maxPrice}</span>
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Availability
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
          >
            <option value="all">All Books</option>
            <option value="available">Available Only</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="title">Title A-Z</option>
            <option value="titleDesc">Title Z-A</option>
            <option value="price">Price Low-High</option>
            <option value="priceDesc">Price High-Low</option>
            <option value="rating">Rating Low-High</option>
            <option value="ratingDesc">Rating High-Low</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.search && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Search: "{filters.search}"
            <button
              onClick={() => handleFilterChange('search', '')}
              className="ml-1 hover:text-blue-600"
            >
              ×
            </button>
          </span>
        )}
        {filters.category && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Category: {filters.category}
            <button
              onClick={() => handleFilterChange('category', '')}
              className="ml-1 hover:text-green-600"
            >
              ×
            </button>
          </span>
        )}
        {filters.maxPrice < maxPrice && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Max Price: ${filters.maxPrice}
            <button
              onClick={() => handleFilterChange('maxPrice', maxPrice)}
              className="ml-1 hover:text-purple-600"
            >
              ×
            </button>
          </span>
        )}
        {filters.availability !== 'all' && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            {filters.availability === 'available' ? 'Available Only' : 'Out of Stock'}
            <button
              onClick={() => handleFilterChange('availability', 'all')}
              className="ml-1 hover:text-yellow-600"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;