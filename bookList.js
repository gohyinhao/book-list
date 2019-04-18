// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Storage.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  // @param className: pass in either success/danger
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }

  static deleteBook(element) {
    element.parentElement.parentElement.remove();
  }
}

// Storage Class: Handles Storage
class Storage {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Storage.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Storage.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (event) => {
  // prevent actual submit
  event.preventDefault();

  // Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // Validation check
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // Instantiate a book
    const book = new Book(title, author, isbn);

    // Add book to list
    UI.addBookToList(book);

    // Add book to storage
    Storage.addBook(book);

    // Show success message
    UI.showAlert('Book Added', 'success');

    // clear fields
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (event) => {
  if (event.target.classList.contains('delete')) {
    UI.deleteBook(event.target);

    // Remove book from storage
    Storage.removeBook(event.target.parentElement.previousElementSibling.textContent);

    // Show success message
    UI.showAlert('Book Removed', 'success');
  }
});