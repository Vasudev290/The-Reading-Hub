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
        imageUrl: "https://covers.openlibrary.org/b/id/8225261-L.jpg",
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
      },
      {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        category: "Romance",
        price: 259,
        stock: 6,
        imageUrl: "https://covers.openlibrary.org/b/id/8091016-L.jpg",
        description:
          "A witty romantic novel about manners, marriage, and social standing.",
      },
      {
        id: 5,
        title: "Harry Potter and the Deathly Hallows",
        author: "J.K. Rowling",
        category: "Fantasy",
        price: 399,
        stock: 10,
        imageUrl: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
        description:
          "The final adventure in the Harry Potter series as the battle with Voldemort concludes.",
      },
      {
        id: 6,
        title: "Words of Radiance",
        author: "Brandon Sanderson",
        category: "Fantasy",
        price: 449,
        stock: 4,
        imageUrl: "https://covers.openlibrary.org/b/id/8232001-L.jpg",
        description:
          "Second book in The Stormlight Archive — epic fantasy, internal conflict, magic and war.",
      },
      {
        id: 7,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        category: "Fantasy",
        price: 329,
        stock: 7,
        imageUrl: "https://covers.openlibrary.org/b/id/6979861-L.jpg",
        description:
          "Bilbo Baggins embarks on an unexpected journey with dwarves to reclaim their mountain home.",
      },
      {
        id: 8,
        title: "Animal Farm",
        author: "George Orwell",
        category: "Political Satire",
        price: 219,
        stock: 5,
        imageUrl: "https://covers.openlibrary.org/b/id/7222276-L.jpg",
        description:
          "An allegorical novella about a farm where animals overthrow humans only to face new tyranny.",
      },
      {
        id: 9,
        title: "The Kite Runner",
        author: "Khaled Hosseini",
        category: "Fiction",
        price: 299,
        stock: 5,
        imageUrl: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
        description:
          "A story of friendship, betrayal, and redemption set against the backdrop of Afghanistan’s history.",
      },
      {
        id: 10,
        title: "The Lord of the Rings: The Fellowship of the Ring",
        author: "J.R.R. Tolkien",
        category: "Fantasy",
        price: 449,
        stock: 2,
        imageUrl: "https://covers.openlibrary.org/b/id/8231851-L.jpg",
        description:
          "The first volume in the epic journey to destroy the One Ring.",
      },
      {
        id: 11,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        category: "Literary",
        price: 239,
        stock: 4,
        imageUrl: "https://covers.openlibrary.org/b/id/8231855-L.jpg",
        description:
          "The story of Holden Caulfield’s cynical teenage years in New York City.",
      },
      {
        id: 12,
        title: "The Bell Jar",
        author: "Sylvia Plath",
        category: "Fiction",
        price: 269,
        stock: 3,
        imageUrl: "https://covers.openlibrary.org/b/id/8225592-L.jpg",
        description:
          "A semi-autobiographical novel about a young woman's mental health struggle.",
      },
      {
        id: 13,
        title: "The Road",
        author: "Cormac McCarthy",
        category: "Post-Apocalyptic",
        price: 289,
        stock: 3,
        imageUrl: "https://covers.openlibrary.org/b/id/7222242-L.jpg",
        description:
          "A bleak but moving tale of a father and son journeying through a devastated world.",
      },
      {
        id: 14,
        title: "Brave New World",
        author: "Aldous Huxley",
        category: "Dystopian",
        price: 259,
        stock: 5,
        imageUrl: "https://covers.openlibrary.org/b/id/8235169-L.jpg",
        description:
          "A futuristic society shaped by engineered happiness, control, and loss of individuality.",
      },
      {
        id: 15,
        title: "Fahrenheit 451",
        author: "Ray Bradbury",
        category: "Science Fiction",
        price: 249,
        stock: 6,
        imageUrl: "https://covers.openlibrary.org/b/id/8114151-L.jpg",
        description:
          "In a future where books are banned, a fireman’s job is to burn them — until he questions everything.",
      },
      {
        id: 16,
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Philosophical Fiction",
        price: 279,
        stock: 8,
        imageUrl: "https://covers.openlibrary.org/b/id/8231859-L.jpg",
        description:
          "A shepherd boy’s journey to fulfill his Personal Legend and discover life’s true meaning.",
      },
      {
        id: 17,
        title: "Never Let Me Go",
        author: "Kazuo Ishiguro",
        category: "Science Fiction / Drama",
        price: 299,
        stock: 4,
        imageUrl: "https://covers.openlibrary.org/b/id/6979141-L.jpg",
        description:
          "A haunting novel about memory, identity, and the darker corners of a dystopian society.",
      },
      {
        id: 18,
        title: "The Brief Wondrous Life of Oscar Wao",
        author: "Junot Díaz",
        category: "Fiction",
        price: 319,
        stock: 3,
        imageUrl: "https://covers.openlibrary.org/b/id/8231864-L.jpg",
        description:
          "A multi-generational saga of a Dominican family, mixing fantasy and history.",
      },
      {
        id: 19,
        title: "My Brilliant Friend",
        author: "Elena Ferrante",
        category: "Literary Fiction",
        price: 329,
        stock: 4,
        imageUrl: "https://covers.openlibrary.org/b/id/8231867-L.jpg",
        description:
          "The first book in the Neapolitan series — a friendship between two women over decades.",
      },
      {
        id: 20,
        title: "A Court of Thorns and Roses",
        author: "Sarah J. Maas",
        category: "Fantasy / Romance",
        price: 349,
        stock: 5,
        imageUrl: "https://covers.openlibrary.org/b/id/8231870-L.jpg",
        description:
          "A retelling of Beauty and the Beast in a dangerous faerie world full of magic and intrigue.",
      },
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
