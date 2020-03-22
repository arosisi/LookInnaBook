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
            return
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
                    } else {
                        payload.send({ success: false, errMessage: "Failed to register user" })
                    }
                })
            }
            return !!err
        }
        
        client.query('BEGIN', err => {
            if (shouldAbort(err)) return
            //Validate user email
            client.query(`SELECT u_id FROM profile WHERE email = '${email}' LIMIT 1`, (err, res) => {
                if (shouldAbort(err)) return
                if (res && res.rows.length > 0) {
                    //If email already registered => fail
                    payload.send({ success: false, errMessage: "Email has already been registered" })
                    return
                } else {
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
                        if (shouldAbort(err)) return
                        const { u_id: userId } = res.rows[0]
                        //Check if card with given card_number already exists
                        client.query(`SELECT card_number 
                                      FROM credit_card_info 
                                      WHERE card_number = ${parseInt(creditCard.replace(/\s/g, ''))}`, (err, res) => {
                            if (shouldAbort(err)) return
                            //Card already exist, check if all info matches
                            if (res && res.rows.length > 0) {
                                const creditCardQuery = `
                                    SELECT card_number
                                    FROM credit_card_info
                                    WHERE card_number = ${creditCard} AND
                                          cvv = '${cvv}' AND
                                          billing_address = '${billingAddress}' AND
                                          holder_name = '${holderName}' AND
                                          expiry_date = '${expiryDate}'`
                                client.query(creditCardQuery, (err, response) => {
                                    if (shouldAbort(err)) return
                                    //If details + number match => give user that card
                                    if (response && response.rows.length > 0) {
                                        const creditCardInsert = 
                                        {
                                            text: 
                                                `INSERT INTO credit_card(u_id, card_number)
                                                        VALUES ($1, $2)`,
                                            values: [
                                                userId,
                                                creditCard
                                            ]
                                        }
                                        client.query(creditCardInsert, err => {
                                            if (shouldAbort(err)) return
                                            client.query('COMMIT', err => {
                                                if (shouldAbort(err)) return
                                                payload.send({ success: true, user: { u_id: userId } })
                                            })
                                        })
                                    } else {
                                        //Details dont match = error
                                        client.query('ROLLBACK', err => {
                                            if (err) {
                                                payload.send({ success: false, errMessage: "Something went very wrong" })
                                            } else {
                                                payload.send({ success: false, errMessage: "Invalid credit card" })
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
                                        parseInt(creditCard), 
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
                                        userId,
                                        parseInt(creditCard)
                                    ]
                                }
                                //else insert user credit card info
                                client.query(creditCardInfoQuery, err => {
                                    if (shouldAbort(err)) return
                                    client.query(creditCardQuery, err => {
                                        if (shouldAbort(err)) return
                                        client.query('COMMIT', err => {
                                            if (shouldAbort(err)) return
                                            payload.send({ success: true, user: { u_id: userId } })
                                        })
                                    })
                                })
                            }
                        })
                    })
                }
            })
        })
    })
    return router
}
