const router = require("express").Router()

module.exports = client => {
    router.get("/", (req, payload) => {
        const publishers = []
        const books = []
        const bookQuery = `
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
              book.isbn = genre.isbn`
        client.query(bookQuery, (err, res) => {
            if (err) {
                payload.send({ success: false, errMessage: "Failed to fetch from database"  })
            } else {
                let currentBook = {}
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
            }
        })
        const publisherQuery = `
        SELECT name
        FROM publisher`
        client.query(publisherQuery, (err, res) => {
            if (err) {
                payload.send({ success: false })
            } else {
                res.rows.forEach(row => publishers.push(row.name))
            }
        })
        
        payload.send({ success: true, books, publishers })
    })
    return router
}
