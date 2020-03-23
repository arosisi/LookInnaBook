const router = require("express").Router()
const nodemailer = require("nodemailer");
const moment = require("moment")

const config = require("../config");

module.exports = client => {
  
    router.post("/", (req, payload) => {
        //Check whether request contains an order
        const books = req && req.body && req.body.books
        if (!books) {
            payload.send({ success: false, errMessage: "Couldn't find valid order infomation" })
            return
        }
        
        //Check whether request contains a card
        const creditCard = req && req.body && req.body.creditCard
        if (!creditCard) {
            payload.send({ success: false, errMessage: "Couldn't find payment info" })
            return
        }
        
        const {
            id: u_id,
            subTotal, 
            tax, 
            shipping, 
            recipient, 
            shippingAddress,
            expiryDate, 
            cvv, 
            holderName, 
            billingAddress
        } = req.body
        
        const purchasedBooksInStock = {}
        
        const shouldAbort = err => {
            if (err) {
                console.error('Error in transaction', err.stack)
                client.query('ROLLBACK', err => {
                    if (err) {
                        payload.send({ success: false, errMessage: "Something went very wrong" })
                    } else {
                        payload.send({ success: false, errMessage: "Failed to process payment" })
                    }
                })
            }
            return !!err
        }
        
        const validateOrder = nextCall => {
            const bookISBN = books.map(item => `'${item.isbn}'`).join(', ')
            client.query(`SELECT isbn, title FROM book WHERE available = false AND isbn IN (${bookISBN})`,
                (err, res) => {
                    if (shouldAbort(err)) return
                    //A book in the order was removed
                    if (res && res.rows.length > 0) {
                        client.query('ROLLBACK', err => {
                            if (err) {
                                payload.send({ success: false, errMessage: "Something went very wrong" })
                            } else {
                                payload.send({ success: false, errMessage: `The book with isbn ${res.rows[0].isbn} was removed from the store`, errCode: 3, title: res.rows[0].title })
                            }
                        })
                    } else {
                        //All books available => check if there are enough books in store
                        const purchasedBooks = {}
                        books.forEach(item => purchasedBooks[item.isbn] = item.quantity)
                        client.query(`SELECT isbn, quantity, title FROM book WHERE available = true AND isbn IN (${bookISBN})`,
                            (err, res) => {
                            if (shouldAbort(err)) return
                            //Check if any books are out of stock
                            if (res && res.rows.length > 0) {
                                for (const book of res.rows) {
                                    if (book.quantity < purchasedBooks[book.isbn]) {
                                        client.query('ROLLBACK', err => {
                                            if (err) {
                                                payload.send({ success: false, errMessage: "Something went very wrong" })
                                            } else {
                                                payload.send({ success: false, errMessage: `The book with isbn ${book.isbn} is out of stock` , errCode: 2, title: book.title })
                                            }
                                        })
                                        return
                                    }
                                    purchasedBooksInStock[book.isbn] = book.quantity
                                }
                                nextCall()
                            } else {
                                //Error querying books
                                client.query('ROLLBACK', err => {
                                    if (err) {
                                        payload.send({ success: false, errMessage: "Something went very wrong" })
                                    } else {
                                        payload.send({ success: false, errMessage: "Failed to process payment" })
                                    }
                                })
                            }
                        })
                    }
                }
            )
        }
        
        const updateCard = nextCall => {
            client.query(`SELECT card_number FROM credit_card_info WHERE card_number = ${parseInt(creditCard.replace(/\s/g, ''))}`, (err, res) => {
                if (shouldAbort(err)) return
                if (res && res.rows.length > 0) {
                    //Check if card_details also match
                    const creditCardQuery = `
                        SELECT card_number
                        FROM credit_card_info
                        WHERE card_number = ${parseInt(creditCard.replace(/\s/g, ''))} AND
                              cvv = '${cvv}' AND
                              billing_address = '${billingAddress}' AND
                              holder_name = '${holderName}' AND
                              expiry_date = '${expiryDate}'`
                              
                    client.query(creditCardQuery, (err, response) => {
                        if (shouldAbort(err)) return
                        //If details + number match => give user that card
                        if (response && response.rows.length > 0) {
                            //Check if card is already associated with the user
                            client.query(`SELECT card_number 
                                          FROM credit_card 
                                          WHERE card_number = ${parseInt(creditCard.replace(/\s/g, ''))} AND 
                                                u_id = ${u_id}`, (err, res) => {
                                if (shouldAbort(err)) return
                                //Card already associated => update user main card
                                if (res && res.rows.length > 0) {
                                    nextCall()
                                } else {
                                    //If not associate card with user
                                    const creditCardInsert = 
                                    {
                                        text: 
                                            `INSERT INTO credit_card(u_id, card_number)
                                                    VALUES ($1, $2)`,
                                        values: [
                                            u_id,
                                            parseInt(creditCard.replace(/\s/g, ''))
                                        ]
                                    }
                                    client.query(creditCardInsert, err => {
                                        if (shouldAbort(err)) return
                                        nextCall()
                                    })
                                }
                            })
                        } else {
                            //Details dont match = error
                            client.query('ROLLBACK', err => {
                                if (err) {
                                    payload.send({ success: false, errMessage: "Something went very wrong" })
                                } else {
                                    payload.send({ success: false, errMessage: "Invalid credit card", errCode: 1 })
                                }
                            })
                        }
                    })
                } else {
                    const creditCardInfoQuery = {
                        text: 
                            `INSERT INTO credit_card_info(
                                card_number,
                                expiry_date,
                                cvv,
                                billing_address,
                                holder_name
                            ) VALUES($1, $2, $3, $4, $5)`,
                        values: [
                            parseInt(creditCard.replace(/\s/g, '')), 
                            expiryDate,
                            cvv,
                            billingAddress,
                            holderName
                        ]
                    }
                    
                    const creditCardQuery = {
                        text: 
                            `INSERT INTO credit_card(
                                u_id,
                                card_number
                            ) VALUES($1, $2)`,
                        values: [
                            u_id,
                            parseInt(creditCard.replace(/\s/g, ''))
                        ]
                    }
                    //Insert new creditcard and associate it with current user
                    client.query(creditCardInfoQuery, err => {
                        if (shouldAbort(err)) return
                        client.query(creditCardQuery, err => {
                            if (shouldAbort(err)) return
                            nextCall()
                        })
                    })
                }
            })
        }

        client.query('BEGIN', err => {
            if (shouldAbort(err)) return
            const query = {
                text: 
                    `INSERT INTO cart(
                        u_id,
                        date, 
                        tax, 
                        subtotal, 
                        confirmed_time, 
                        shipped_time, 
                        received_time,
                        shipping_cost,
                        shipping_address,
                        recipient,
                        card_number
                    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING order_id`,
                values: [
                    u_id,
                    moment().format('MMMM DD YYYY'),
                    tax,
                    subTotal,
                    moment().add(5, 'm').format('MMMM Do YYYY, h:mm:ss a'),
                    moment().add(10, 'h').format('MMMM Do YYYY, h:mm:ss a'),
                    moment().add(18, 'h').format('MMMM Do YYYY, h:mm:ss a'),
                    shipping,
                    shippingAddress,
                    recipient,
                    parseInt(creditCard.replace(/\s/g, ''))
                ]
            }
            //Creating an order
            validateOrder(() => updateCard(() => client.query(query, (err, res) => {
                    if (shouldAbort(err)) return
                    const { order_id } = res.rows[0]
                    let orderItemsQuery = 'INSERT INTO cart_book(isbn, order_id, quantity, price) VALUES '
                    orderItemsQuery += books.map(book => `('${book.isbn}', ${order_id}, ${book.quantity}, ${book.price})`).join(', ')
                    client.query(orderItemsQuery, err => {
                        if (shouldAbort(err)) return
                        //Reduce quantity of book in stock by amount purchased
                        const newBookQuantity = books.map(book => 
                            `('${book.isbn}', ${purchasedBooksInStock[book.isbn] - book.quantity})`).join(', ')
                        const bookUpdateQuery = 
                        `UPDATE book
                        SET
                            quantity = book2.quantity
                        FROM (VALUES
                            ${newBookQuantity}
                        ) as book2(isbn, quantity)
                        WHERE book.isbn = book2.isbn`
                        client.query(bookUpdateQuery, err => {
                            if (shouldAbort(err)) return
                            client.query('COMMIT', err => {
                                if (shouldAbort(err)) return
                                payload.send({ success: true, order: { order_id } })
                            })
                        })
                    })
                })
            ))
        })
    })
    return router
}
