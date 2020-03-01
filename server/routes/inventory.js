const router = require("express").Router();

module.exports = client => {
  router.get("/", (req, res) => {
    const publishers = [];
    const books = [];
    const bookQuery = `
        SELECT 
              book-pub.percentage as publisher_percentage,
              author.author,
              genre.genre,
              book-pub.pub_name as publisher,
              book.cover_url,
              book.available,
              book.cost,
              book.threshold,
              book.quantity,
              book.price,
              book.title,
              book.isbn,
              book.year,
              book.page_count,
              book.description
        FROM author, book, genre, book-pub
        WHERE author.isbn = book.isbn AND
              book.isbn = genre.isbn AND
              book-pub.isbn = book.isbn`
    client.query(bookQuery, (err, response) => {
        if (err) {
            res.send({ success: false });
        } else {
            const currentBook = {};
            response.rows.forEach(row => {
                if (!currentBook) {
                    const { author, genre, ...other } = row;
                    currentBook = { ...other, authors: [author], genres: [genre] };
                } else if (currentBook.isbn !== row.isbn) {
                    books.push(currentBook);
                    const { author, genre, ...other } = row;
                    currentBook = { ...other, authors: [author], genres: [genre] };
                } else {
                    if (currentBook.authors.indexOf(row.author) < 0) {
                        currentBook.authors.push(row.author);
                    }
                    if (currentBook.genres.indexOf(row.genre) < 0) {
                        currentBook.genres.push(row.genre);
                    }
                }
            })
        }
    });
    const publisherQuery = `
        SELECT name
        FROM publisher`
    client.query(bookQuery, (err, response) => {
        if (err) {
            res.send({ success: false });
        } else {
            response.rows.forEach(row => publishers.push(row.name))
        }
    })
    
    res.send({ success: true, books, publishers });
  });
  return router;
};
