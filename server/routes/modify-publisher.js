const router = require("express").Router()
const nodemailer = require("nodemailer");
const moment = requrie("moment")

const config = require("../config");

module.exports = client => {
    
    //Check whether request contains an action
    router.use((req, res) => {
        const action = req && req.body && req.body.action
        if (!action) {
            res.send({ success: false, errMessage: "Couldn't find a valid action" })
        }
        next()
    })
  
    router.post("/", (req, payload) => {
        
        const {
            action, 
            name, 
            newName, 
            address, 
            email, 
            numbers, 
            bankAccount 
        } = req.body
        
        let query = ''
        
        if (action === 'remove') {
            query = `UPDATE publisher SET available = false WHERE name = ${name}`
        } else if (action === 'add' ) {
            query = {
                text: 
                    'INSERT INTO publisher(
                        name, 
                        email, 
                        bank_account, 
                        address, 
                        available
                    ) VALUES($1, $2, $3, $4, $5)',
                values: [
                    newName,
                    email,
                    bankAccount
                    address,
                    true
                ]
            }
        } else {
            query = query.concat(
                'UPDATE credit_card SET ',
                newName ? `name = ${newName},` : '',
                email ? `email = ${email},` : '',
                bankAccount ? `bank_account = ${bankAccount},` : '',
                address ? `address = ${address}` : '',
                ` WHERE name = ${name}`
            )
            
        }
        
        client.query(query, (err, res) => {
            if (err) {
                payload.send({ success: false, errMessage: "Failed to update publisher info" })
            }
        })
        if (action === "add" && numbers) {
            client.query(
                {
                    text: 
                        'INSERT INTO pub_phone_number(
                            name, 
                            number
                        ) VALUES($1, $2)',
                    values: [
                        newName,
                        numbers
                    ]
                }
                , err => {
                    if (err) {
                        payload.send({ success: false, errMessage: "Failed to update publisher info" })
                    }
                }
            )
        } else if (action === "edit" && numbers) {
            client.query(
                `UPDATE pub_phone_number 
                SET 
                    number = ${numbers}
                WHERE name = ${newName || name}`,
                err => {
                    if (err) {
                        payload.send({ success: false, errMessage: "Failed to update publisher info" })
                    }
                }
            )
        }
        payload.send({ success: true })
    })
    return router
}
