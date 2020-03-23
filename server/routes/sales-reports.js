const router = require("express").Router()

module.exports = client => {
    
    router.post("/", (req, payload) => {
        const shouldAbort = err => {
            if (err) {
                console.error('Error in transaction', err.stack)
                client.query('ROLLBACK', err => {
                    if (err) {
                        payload.send({ success: false, errMessage: "Something went very wrong" })
                    } else {
                        payload.send({ success: false, errMessage: "Failed to retrieve sales info" })
                    }
                })
            }
            return !!err
        }
        
        const report = {}
        
        const retrieveAllSales = nextCall => {
            const bookList = {}
            let sales = 0
            //Get all the books currently in the db
            client.query(
                `SELECT isbn, quantity, cost
                FROM book`, (err, res) => {
                if (shouldAbort(err)) return
                res.rows.forEach(book => bookList[book.isbn] = { quantity: book.quantity, cost: book.cost })
                //Get all orders
                client.query(
                    `SELECT 
                        cart_book.isbn,
                        cart_book.quantity,
                        cart_book.price
                    FROM cart, cart_book
                    WHERE cart.order_id = cart_book.order_id`, (err, res) => {
                    if (shouldAbort(err)) return
                    res.rows.forEach(book => {
                        //Calculate how many books there were initially
                        if (bookList[book.isbn]) {
                            bookList[book.isbn] += book.quantity
                        }
                        sales += book.price * book.quantity
                    })
                    let expenditures = 0
                    for (const item in bookList) {
                        expenditures += bookList[item].quantity * bookList[item].cost
                    }
                    report[sales] = sales
                    report[expenditures] = expenditures
                    nextCall()
                })
            })
        }
        
        const retrieveSalesByGenre = nextCall => {
            //Get all the book sales
            client.query(
                `SELECT 
                    genre.genre,
                    cart_book.isbn,
                    cart_book.quantity,
                    cart_book.price
                FROM cart, cart_book, book, genre
                WHERE cart.order_id = cart_book.order_id AND
                      cart_book.isbn = book.isbn AND
                      book.isbn = genre.isbn`, (err, res) => {
                if (shouldAbort(err)) return
                res.rows.forEach(book => {
                    //Calculate how many books there were initially
                    if (report[book.genre]) {
                        report[book.genre] += book.quantity * book.price
                    } else {
                        report[book.genre] = book.quantity * book.price
                    }
                })
                nextCall()
            })
        }
        
        const retrieveSalesByAuthor = nextCall => {
            //Get all the book sales
            client.query(
                `SELECT 
                    author.author,
                    cart_book.isbn,
                    cart_book.quantity,
                    cart_book.price
                FROM cart, cart_book, book, author
                WHERE cart.order_id = cart_book.order_id AND
                      cart_book.isbn = book.isbn AND
                      book.isbn = author.isbn`, (err, res) => {
                if (shouldAbort(err)) return
                res.rows.forEach(book => {
                    //Calculate how many books there were initially
                    if (report[book.author]) {
                        report[book.author] += book.quantity * book.price
                    } else {
                        report[book.author] = book.quantity * book.price
                    }
                })
                nextCall()
            })
        }
        
        const retrieveSalesByPublisher = nextCall => {
            client.query(
                `SELECT name
                FROM publisher`, (err, res) => {
                if (shouldAbort(err)) return
                res.rows.forEach(pub => report[pub.name] = 0)
                //Get all the book sales
                client.query(
                    `SELECT 
                        cart_book.isbn,
                        cart_book.quantity,
                        cart_book.price,
                        book.pub_name
                    FROM cart, cart_book, book
                    WHERE cart.order_id = cart_book.order_id AND
                          cart_book.isbn = book.isbn`, (err, res) => {
                    if (shouldAbort(err)) return
                    res.rows.forEach(book => {
                        //Calculate how many books there were initially
                        report[book.pub_name] += book.quantity * book.price
                    })
                    nextCall()
                })
            })
        }
        
        //The actual transaction
        client.query('BEGIN', err => {
            if (shouldAbort(err)) return
            const type = req && req.body.type
            let operation = retrieveAllSales
            if (type === 'genre') { operation = retrieveSalesByGenre }
            else if (type === 'author') { operation = retrieveSalesByAuthor }
            else if (type === 'publisher') {operation = retrieveSalesByPublisher }
            
            operation(() => {
                client.query('COMMIT', err => {
                    if (shouldAbort(err)) return
                    payload.send({ success: true, report })
                })
            })
        })
    })
    return router
}
