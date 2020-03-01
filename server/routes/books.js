const router = require("express").Router();

module.exports = client => {
  router.get("/", (req, res) => {
    const query = `
        SELECT *
        FROM author, book, genre
        WHERE author.isbn = book.isbn AND
              book.isbn = genre.isbn`
    client.query(query, (err, response) => {
        if (err) {
            response.send({ success: false });
        } else {
            const books = [];
            const currentBook = {};
            res.rows.forEach(row => {
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
            response.send({ success: true, books });
        }
    });
  });
  return router;
};
