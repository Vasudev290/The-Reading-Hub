import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  books: JSON.parse(localStorage.getItem("books")) || [
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Classic",
      price: 12.99,
      rating: 4.5,
      stock: 5,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
      description: "A classic novel of the Jazz Age.",
      reviews: [
        {
          id: "1",
          userId: "2",
          userName: "John Doe",
          rating: 5,
          comment: "Amazing book!",
          date: "2024-01-15",
        },
      ],
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      category: "Fiction",
      price: 14.99,
      rating: 4.8,
      stock: 3,
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      description: "A gripping tale of racial injustice.",
      reviews: [],
    },
  ],
  filters: {
    search: "",
    category: "",
    minPrice: 0,
    maxPrice: 100,
    availability: "all",
  },
  sortBy: "title",
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    addBook: (state, action) => {
      const newBook = {
        id: Date.now().toString(),
        reviews: [],
        ...action.payload,
      };
      state.books.push(newBook);
      localStorage.setItem("books", JSON.stringify(state.books));
    },
    updateBook: (state, action) => {
      const index = state.books.findIndex(
        (book) => book.id === action.payload.id
      );
      if (index !== -1) {
        state.books[index] = { ...state.books[index], ...action.payload };
        localStorage.setItem("books", JSON.stringify(state.books));
      }
    },
    deleteBook: (state, action) => {
      state.books = state.books.filter((book) => book.id !== action.payload);
      localStorage.setItem("books", JSON.stringify(state.books));
    },
    borrowBook: (state, action) => {
      const book = state.books.find((b) => b.id === action.payload);
      if (book && book.stock > 0) {
        book.stock -= 1;
        localStorage.setItem("books", JSON.stringify(state.books));
      }
    },
    returnBook: (state, action) => {
      const book = state.books.find((b) => b.id === action.payload);
      if (book) {
        book.stock += 1;
        localStorage.setItem("books", JSON.stringify(state.books));
      }
    },
    addReview: (state, action) => {
      const { bookId, review } = action.payload;
      const book = state.books.find((b) => b.id === bookId);
      if (book) {
        book.reviews.push(review);

        // Update average rating
        const totalRating = book.reviews.reduce((sum, r) => sum + r.rating, 0);
        book.rating = totalRating / book.reviews.length;

        localStorage.setItem("books", JSON.stringify(state.books));
      }
    },
    updateReview: (state, action) => {
      const { bookId, reviewId, updatedReview } = action.payload;
      const book = state.books.find((b) => b.id === bookId);
      if (book) {
        const reviewIndex = book.reviews.findIndex((r) => r.id === reviewId);
        if (reviewIndex !== -1) {
          book.reviews[reviewIndex] = {
            ...book.reviews[reviewIndex],
            ...updatedReview,
          };

          // Update average rating
          const totalRating = book.reviews.reduce(
            (sum, r) => sum + r.rating,
            0
          );
          book.rating = totalRating / book.reviews.length;

          localStorage.setItem("books", JSON.stringify(state.books));
        }
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
});

export const {
  addBook,
  updateBook,
  deleteBook,
  borrowBook: borrowBookAction,
  returnBook: returnBookAction,
  addReview,
  updateReview,
  setFilters,
  setSortBy,
} = bookSlice.actions;

export default bookSlice.reducer;
