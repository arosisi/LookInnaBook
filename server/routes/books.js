const router = require("express").Router()

module.exports = client => {
    router.post("/", (req, payload) => {
        const isbns = req && req.body && req.body.isbns
        const requestedBooksQuery = Array.isArray(isbns) && isbns.length > 0 ? ` AND book.isbn IN (${isbns.map(isbn => `'${isbn}'`).join(", ")})` : ''
        // TODO: delete after fixing
        const query = `
        SELECT 
              book.percentage as publisher_percentage,
              author.author,
              genre.genre,
              book.pub_name as publisher,
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
        FROM author, book, genre
        WHERE author.isbn = book.isbn AND
              book.isbn = genre.isbn` + requestedBooksQuery
        client.query(query, (err, res) => {
            if (err) {
                payload.send({ success: false, errMessage: "Failed to fetch from database" })
            } else {
                // TODO: delete after fixing
                const books = []
                let currentBook = null
                res.rows.forEach((row, i) => {
                    if (!currentBook) {
                        const { author, genre, ...other } = row
                        currentBook = { ...other, authors: [author], genres: [genre] }
                    } else if (i === res.rows.length - 1) {
                        books.push(currentBook)
                    } else if (currentBook.isbn !== row.isbn ) {
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
                payload.send({ success: true, books })
            }
        })
    })
    return router
}
