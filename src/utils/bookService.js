// src/utils/bookService.js
class BookService {
  constructor() {
    this.books = JSON.parse(localStorage.getItem("books")) || [];
    this.borrowedBooks =
      JSON.parse(localStorage.getItem("borrowedBooks")) || [];

    // Initialize with sample books if empty
    if (this.books.length === 0) {
      this.initializeSampleBooks();
    }
  }

  initializeSampleBooks() {
    const sampleBooks = [
      {
        id: 1,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Classic",
        price: 299,
        stock: 5,
        imageUrl: "/images/to-kill-a-mockingbird.jpeg",
        description:
          "A novel about racial injustice in the Deep South, through the eyes of young Scout Finch.",
      },
      {
        id: 2,
        title: "1984",
        author: "George Orwell",
        category: "Dystopian",
        price: 249,
        stock: 4,
        imageUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
        description:
          "A chilling depiction of totalitarian government surveillance and control.",
      },
      {
        id: 3,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Classic",
        price: 279,
        stock: 3,
        imageUrl: "https://covers.openlibrary.org/b/id/7352161-L.jpg",
        description:
          "The tragic story of Jay Gatsby and his unrequited love for Daisy Buchanan.",
      }
    ];
    this.books = sampleBooks;
    this.saveBooks();
  }

  saveBooks() {
    localStorage.setItem("books", JSON.stringify(this.books));
  }

  saveBorrowedBooks() {
    localStorage.setItem("borrowedBooks", JSON.stringify(this.borrowedBooks));
  }

  getAllBooks() {
    return this.books;
  }

  getBookById(id) {
    return this.books.find((book) => book.id === id);
  }

  addBook(bookData) {
    const newBook = {
      id: Date.now().toString(),
      ...bookData,
      rating: 0,
      reviews: [],
      createdAt: new Date().toISOString(),
    };

    this.books.push(newBook);
    this.saveBooks();
    return newBook;
  }

  updateBook(id, bookData) {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    if (bookIndex !== -1) {
      this.books[bookIndex] = { ...this.books[bookIndex], ...bookData };
      this.saveBooks();
      return this.books[bookIndex];
    }
    return null;
  }

  deleteBook(id) {
    this.books = this.books.filter((book) => book.id !== id);
    this.saveBooks();
    return true;
  }

  borrowBook(bookId, userId) {
    const book = this.getBookById(bookId);
    if (!book || book.stock <= 0) {
      return { success: false, error: "Book not available" };
    }

    // Check if user already borrowed this book
    const alreadyBorrowed = this.borrowedBooks.find(
      (record) =>
        record.bookId === bookId && record.userId === userId && !record.returned
    );

    if (alreadyBorrowed) {
      return { success: false, error: "You have already borrowed this book" };
    }

    // Update stock
    book.stock -= 1;
    this.saveBooks();

    // Add to borrowed records
    const borrowRecord = {
      id: Date.now().toString(),
      bookId,
      userId,
      borrowedAt: new Date().toISOString(),
      returned: false,
    };

    this.borrowedBooks.push(borrowRecord);
    this.saveBorrowedBooks();

    return { success: true, record: borrowRecord };
  }

  returnBook(borrowId) {
    const recordIndex = this.borrowedBooks.findIndex(
      (record) => record.id === borrowId
    );
    if (recordIndex !== -1) {
      const record = this.borrowedBooks[recordIndex];
      const book = this.getBookById(record.bookId);

      if (book) {
        book.stock += 1;
        this.saveBooks();
      }

      this.borrowedBooks[recordIndex].returned = true;
      this.borrowedBooks[recordIndex].returnedAt = new Date().toISOString();
      this.saveBorrowedBooks();

      return { success: true };
    }
    return { success: false, error: "Borrow record not found" };
  }

  addReview(bookId, userId, review, rating) {
    const book = this.getBookById(bookId);
    if (!book) return null;

    const newReview = {
      id: Date.now().toString(),
      userId,
      review,
      rating,
      createdAt: new Date().toISOString(),
    };

    book.reviews.push(newReview);

    // Update book rating
    const totalRating = book.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    book.rating = totalRating / book.reviews.length;

    this.saveBooks();
    return newReview;
  }

  getBorrowedBooksByUser(userId) {
    return this.borrowedBooks
      .filter((record) => record.userId === userId && !record.returned)
      .map((record) => ({
        ...record,
        book: this.getBookById(record.bookId),
      }));
  }

  getAllBorrowedBooks() {
    return this.borrowedBooks
      .filter((record) => !record.returned)
      .map((record) => ({
        ...record,
        book: this.getBookById(record.bookId),
      }));
  }

  searchBooks(query) {
    const lowerQuery = query.toLowerCase();
    return this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery)
    );
  }

  getBooksByCategory(category) {
    return this.books.filter((book) => book.category === category);
  }

  getTopRatedBooks(limit = 5) {
    return [...this.books].sort((a, b) => b.rating - a.rating).slice(0, limit);
  }

  getCategories() {
    return [...new Set(this.books.map((book) => book.category))];
  }
}

export const bookService = new BookService();
