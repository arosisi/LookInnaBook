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
            if (err) {
                console.log(err)
                payload.send({ success: false, errMessage: "Failed to register user" })
            } else {
                const { u_id: userId } = res.rows[0]
                const creditCardQuery = {
                    text: 
                        `INSERT INTO credit_card(
                            u_id,
                            card_number,
                            expiry_date,
                            cvv,
                            billing_address,
                            holderName
                        ) VALUES(userId, $1, $2, $3, $4, $5 )`,
                    values: [
                        creditCard, 
                        expiryDate,
                        cvv,
                        billingAddress,
                        holderName
                    ]
                }
                
                //Insert user credit card
                client.query(creditCardQuery, e => {
                    if (e) {
                        payload.send({ success: false, errMessage: "Failed to register user payment info" })
                    } else {
                        payload.send({ success: true, user: { u_id: userId } })
                    }
                })
            }
        })
        
    })
    return router
}
