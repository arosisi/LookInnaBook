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
            id,
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
        
        const updateCard = nextCall => {
            client.query(`SELECT card_number FROM credit_card_info WHERE card_number = ${creditCard.replace(/\s/g, '')}`, (err, res) => {
                if (shouldAbort(err)) return
                if (res && res.rows.length > 0) {
                    nextCall()
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
                            id,
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
                    id,
                    moment().format('MMMM Do YYYY, h:mm:ss a'),
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
            updateCard(() => client.query(query, (err, res) => {
                    if (shouldAbort(err)) return
                    const { order_id } = res.rows[0]
                    let orderItemsQuery = 'INSERT INTO cart_book(isbn, order_id, quantity) VALUES '
                    orderItemsQuery += books.map(book => `(${book.isbn}, ${order_id}, ${book.quantity})`).join(', ')
                    client.query(orderItemsQuery, err => {
                        if (shouldAbort(err)) return
                        client.query('COMMIT', err => {
                            if (shouldAbort(err)) return
                            payload.send({ success: true, order: { order_id } })
                        })
                    })
                })
            )
        })
    })
    return router
}
