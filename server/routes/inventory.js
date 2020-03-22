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
              
        const getBookData = nextCall => {
            client.query(bookQuery, (err, res) => {
                if (err) {
                    payload.send({ success: false, errMessage: "Failed to fetch from database"  })
                } else {
                    let currentBook = null
                    res.rows.forEach((row, i) => {
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
                        if (i === res.rows.length - 1) {
                            books.push(currentBook)
                        }
                    })
                    nextCall()
                }
            })
        }
        
        const getPublisherData = nextCall => {
            const publisherQuery = `
            SELECT name
            FROM publisher`
            client.query(publisherQuery, (err, res) => {
                if (err) {
                    payload.send({ success: false })
                } else {
                    res.rows.forEach(row => publishers.push(row.name))
                    nextCall()
                }
            })
        }
        
        getBookData(() => 
            getPublisherData(() => {
                payload.send({ success: true, books }) 
            })
        )
    })
    return router
}
