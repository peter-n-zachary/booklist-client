'use strict';
var app = app || {};
const __API_URL__ = 'http://localhost:3000';
// const __API_URL__ = 'https://zs-pk-booklist.herokuapp.com';


(function (module) {
  function errorCallback(err) {
    console.error(err);
    module.errorView.initErrorPage(err);
  }
  function Book(rawBookObj) {
    // author, title, isbn, image_url, description
    Object.keys(rawBookObj).forEach(key => this[key] = rawBookObj[key]);

  }

  Book.all = [];

  Book.prototype.toHtml = function () {
    let template = Handlebars.compile($('#book-list-template').text());

    return template(this);
  };

  // Book.prototype.singleToHtml = function () {
  //   let template = Handlebars.compile($('#single-book-list-template').text());

  //   return template(this);
  // };

  Book.loadAll = rows => {
    //
    Book.all = rows.sort((a, b) => a.book_id - b.book_id).map(book => new Book(book));

  };

  Book.fetchAll = callback => {
    $.get(`${__API_URL__}/api/v1/books`)
      .then(Book.loadAll)
      .then(callback)
      .catch(errorCallback);

  };

  Book.fetchOne = (ctx, callback) => {
    console.log('triggered fetchone');
    $.get(`${__API_URL__}/api/v1/books/${ctx.params.book_id}`)
      // .then(Book.loadAll)
      // .then(array => new Book(array[0]))
      .then(results => ctx.book = results[0])
      .then(callback)
      .catch(errorCallback);
  };

  Book.prototype.createNewBook = book => {
    $.post(`${__API_URL__}/api/v1/books`, book)
      .then(() => page('/'))
      .catch(errorCallback);
  }

  Book.prototype.updateBook = (book) => {
    $.ajax({
      url: `${__API_URL__}/api/v1/book-${book.book_id}/update`,
      method: 'PUT',
      data: book
    })
      .then(() => page('/'))
      .catch(errorCallback);
  };

  Book.deleteBook = (id) => {
    $.ajax({
      url: `${__API_URL__}/api/v1/book/delete`,
      method: 'DELETE',
      data: {book_id : id}
    })
      .then(() => page('/'));
  };

  Book.cancel = () => {
    console.log('hitting here?');
    page('/');
  };

  module.Book = Book;
})(app);

