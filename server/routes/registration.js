const router = require("express").Router()
const nodemailer = require("nodemailer");
const moment = require("moment")

const config = require("../config");

module.exports = client => {
    router.post("/", (req, payload) => {
        //Check whether request contains a body
        const body = req && req.body
        if (!body) {
            payload.send({ success: false, errMessage: "Couldn't find registration information" })
        }
        const { 
            firstName, 
            lastName, 
            address, 
            email, 
            password, 
            creditCard, 
            expiryDate, 
            cvv, 
            holderName, 
            billingAddress
        } = body
        
        const shouldAbort = err => {
            if (err) {
                console.error('Error in transaction', err.stack)
                client.query('ROLLBACK', err => {
                    if (err) {
                        payload.send({ success: false, errMessage: "Something went very wrong" })
                    }
                })
                payload.send({ success: false, errMessage: "Failed to register user" })
            }
        }
        
        client.query('BEGIN', err => {
            shouldAbort(err)
            const query = {
                text: 
                    `INSERT INTO profile(
                        first_name,
                        last_name,
                        address,
                        email,
                        password,
                        card_number,
                        role
                    ) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING u_id`,
                values: [
                    firstName, 
                    lastName, 
                    address, 
                    email, 
                    password, 
                    parseInt(creditCard),
                    "user"
                ]
            }
            //Add new user with default role "user"
            client.query(query, (err, res) => {
                shouldAbort(err)
                const { u_id: userId } = res.rows[0]
                const creditCardQuery = {
                    text: 
                        `INSERT INTO credit_card(
                            u_id,
                            card_number
                        ) VALUES($1, $2)`,
                    values: [
                        userId
                        parseInt(creditCard)
                    ]
                }
                //Insert user credit card
                client.query(creditCardQuery, err => {
                    shouldAbort(err)
                    const creditCardInfoQuery = {
                        text: 
                            `INSERT INTO credit_card_info(
                                card_number,
                                expiry_date,
                                cvv,
                                billing_address,
                                holderName
                            ) VALUES($1, $2, $3, $4, $5)`,
                        values: [
                            parseInt(creditCard), 
                            expiryDate,
                            cvv,
                            billingAddress,
                            holderName
                        ]
                    }
                    //Insert user credit card info
                    client.query(creditCardInfoQuery, err => {
                        shouldAbort(err)
                        client.query('COMMIT', err => {
                            shouldAbort(err)
                            payload.send({ success: true, user: { u_id: userId } })
                        })
                    })
                })
            }
        })
    })
    return router
}
