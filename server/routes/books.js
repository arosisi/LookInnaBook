const router = require("express").Router()

module.exports = client => {
    router.post("/", (req, res) => {
        const isbns = req && req.body && req.body.isbns
        const requestedBooksQuery = Array.isArray(isbns) && isbns.length > 0 ? ` AND book.isbn IN (${isbns})` : ''
        const query = `
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
              book-pub.isbn = book.isbn` + requestedBooksQuery
        client.query(query, (err, response) => {
            if (err) {
                response.send({ success: false, errMessage: "Failed to fetch from database" })
            } else {
                const books = []
                const currentBook = {}
                res.rows.forEach(row => {
                    if (!currentBook) {
                        const { author, genre, ...other } = row
                        currentBook = { ...other, authors: [author], genres: [genre] }
                    } else if (currentBook.isbn !== row.isbn) {
                        books.push(currentBook)
                        const { author, genre, ...other } = row
                        currentBook = { ...other, authors: [author], genres: [genre] }
                    } else {
                        if (currentBook.authors.indexOf(row.author) < 0) {
                            currentBook.authors.push(row.author)
                        }
                        if (currentBook.genres.indexOf(row.genre) < 0) {
                            currentBook.genres.push(row.genre)
                        }
                    }
                })
                response.send({ success: true, books })
            }
        })
    })
    return router
}
