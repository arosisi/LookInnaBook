const router = require("express").Router()
const nodemailer = require("nodemailer");
const moment = require("moment")

const config = require("../config");

module.exports = client => {
    
    //Check whether request contains an order
    router.use((req, res) => {
        const books = req && req.body && req.body.books
        if (!books) {
            res.send({ success: false, errMessage: "Couldn't find valid order infomation" })
        }
        next()
    })
    
    //Check whether request contains a card
    router.use((req, res) => {
        const creditCard = req && req.body && req.body.creditCard
        if (!creditCard) {
            res.send({ success: false, errMessage: "Couldn't find payment info" })
        }
        next()
    })
  
    router.post("/", (req, payload) => {
        
        const { 
            books, 
            subTotal, 
            tax, 
            shipping, 
            recipient, 
            shippingAddress, 
            creditCard, 
            expiryDate, 
            cvv, 
            holderName, 
            billingAddress
        } = req.body
        
        const query = {
            text: 
                `INSERT INTO cart(
                    date, 
                    tax, 
                    subtotal, 
                    confirmed_time, 
                    shipped_time, 
                    received_time
                    shipping_cost,
                    shipping_address,
                    recipient
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING order_id`,
            values: [
                moment().format('MMMM Do YYYY, h:mm:ss a'),
                tax,
                subTotal,
                moment().add(5, 'm').format('MMMM Do YYYY, h:mm:ss a'),
                moment().add(10, 'h').format('MMMM Do YYYY, h:mm:ss a'),
                moment().add(18, 'h').format('MMMM Do YYYY, h:mm:ss a'),
                shipping,
                shippingAddress,
                recipient
            ]
        }
        
        client.query(query, (err, res) => {
            if (err) {
                payload.send({ success: false, errMessage: "Failed to process payment" })
            } else {
                const { order_id } = res.rows[0]
                let orderItemsQuery = 'INSERT INTO cart_book(isbn, order_id, quantity) VALUES '
                for (const book of books) {
                    orderItemsQuery += `(${book.isbn}, ${order_id}, ${book.quantity}),`
                }
                //Slice off last , in query
                orderItemsQuery = orderItemsQuery.slice(0, -1)
                client.query(orderItemsQuery, e => {
                    if (e) {
                        payload.send({ success: false, errMessage: "Failed to process order" })
                    } else {
                        payload.send({ success: true, order: { order_id } })
                    }
                })
            }
        })
    })
    return router
}
