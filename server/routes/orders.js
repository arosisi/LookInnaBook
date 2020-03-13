const router = require("express").Router()

module.exports = client => {
    
    //Check whether request contains a valid userId in body
    router.use((req, res) => {
        const userId = req && req.body && req.body.u_id
        if (!userId) {
            res.send({ success: false, errMessage: "Couldn't find an user id" })
        }
        client.query(`SELECT u_id FROM profile WHERE u_id = ${userId}`, err => {
            if (err) {
                res.send({ success: false, errMessage: "Couldn't find user with given ID" })
            } else if (res.rows.length < 1) {
                res.send({ success: false, errMessage: "Couldn't find user with given ID" })
            } else {
                next()
            }
        })
    })
  
    router.post("/", (req, payload) => {
        const userId = req.body.u_id
        const query = `
        SELECT 
              cart.order_id,
              cart.date,
              cart_book.isbn,
              cart_book.quantity
              book.title,
              book.price,
              cart.tax,
              cart.shipping_cost,
              cart.confirmed_time,
              cart.shipped_time,
              cart.received_time
        FROM cart_profile, cart, cart_book, book
        WHERE cart_profile.u_id = ${userId} AND
              cart_profile.order_id = cart.order_id AND
              cart_profile_id = cart_book.order_id AND
              cart_book.isbn = book.isbn`
        client.query(query, (err, res) => {
            if (err) {
                payload.send({ success: false, errMessage: "Failed to fetch from database" })
            } else {
                const orders = []
                const currentOrder = {}
                const includedBooks = []
                res.rows.forEach(row => {
                    if (!currentOrder) {
                        const { isbn, quantity, title, price, ...other } = row
                        includedBooks.push(isbn)
                        currentOrder = { ...other, books: [{ isbn, quantity, title, price }] }
                    } else if (currentOrder.order_id !== row.order_id) {
                        orders.push(currentOrder)
                        const { isbn, quantity, title, price, ...other } = row
                        includedBooks = [isbn]
                        currentOrder = { ...other, books: [{ isbn, quantity, title, price }] }
                    } else {
                        if (includedBooks.indexOf(row.isbn) < 0) {
                            includedBooks.push(row.isbn)
                            currentOrder.books.push({ 
                                isbn: row.isbn, 
                                quantity: row.quantity, 
                                title: row.title, 
                                price: row.price 
                            });
                        }
                    }
                })
                payload.send({ success: true, books })
            }
        })
    })
    return router
}
