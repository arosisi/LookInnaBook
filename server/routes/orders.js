const router = require("express").Router()

module.exports = client => {
  
    router.post("/", (req, payload) => {
        //Check whether request contains a valid userId in body
        const userId = req && req.body && req.body.u_id
        if (!userId) {
            payload.send({ success: false, errMessage: "Couldn't find an user id" })
            return
        }
        
        const query = `
        SELECT 
              cart.order_id,
              cart.date,
              cart_book.isbn,
              cart_book.quantity,
              book.title,
              cart_book.price,
              cart.tax,
              cart.shipping_cost,
              cart.confirmed_time,
              cart.shipped_time,
              cart.received_time,
              cart.card_number
        FROM cart, cart_book, book
        WHERE cart.u_id = ${userId} AND
              cart.order_id = cart_book.order_id AND
              cart_book.isbn = book.isbn`
        client.query(query, (err, res) => {
            if (err) {
                payload.send({ success: false, errMessage: "Failed to fetch from database" })
            } else {
                // bug below <-- TODO: delete this comment after fixing
                const orders = []
                let currentOrder = null
                let includedBooks = []
                res.rows.forEach((row, i) => {
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
                    if (i === res.rows.length - 1) {
                        orders.push(currentOrder)
                    } 
                })
                payload.send({ success: true, orders })
            }
        })
    })
    return router
}
