const router = require("express").Router()
const nodemailer = require("nodemailer");
const moment = require("moment")

const config = require("../config");

module.exports = client => {
  
    router.post("/", (req, payload) => {
        //Check whether request contains an action
        const action = req && req.body && req.body.action
        if (!action) {
            payload.send({ success: false, errMessage: "Couldn't find a valid action" })
        }
        
        const {
            name, 
            newName, 
            address, 
            email, 
            numbers, 
            bankAccount 
        } = req.body
        
        const shouldAbort = err => {
            if (err) {
                console.error('Error in transaction', err.stack)
                client.query('ROLLBACK', err => {
                    if (err) {
                        payload.send({ success: false, errMessage: "Something went very wrong" })
                    }
                })
                payload.send({ success: false, errMessage: "Failed to update publisher info" })
            }
        }
        
        let query = ''
        
        const updatePublisher = nextCall => {
            if (action === 'remove') {
                query = `UPDATE publisher SET available = false WHERE name = '${name}'`
                client.query(query, err => {
                    shouldAbort(err)
                    nextCall()
                })
            } else if (action === 'add' ) {
                query = {
                    text: 
                        `INSERT INTO publisher(
                            name, 
                            email, 
                            bank_account, 
                            address, 
                            available
                        ) VALUES($1, $2, $3, $4, $5)`,
                    values: [
                        newName,
                        email,
                        bankAccount,
                        address,
                        true
                    ]
                }
                client.query(query, err => {
                    shouldAbort(err)
                    nextCall()
                })
            } else {
                const attributeUpdate = ''.concat(
                        newName ? `name = '${newName}',` : '',
                        email ? `email = '${email}',` : '',
                        bankAccount ? `bank_account = '${bankAccount}',` : '',
                        address ? `address = '${address}',` : ''
                    )
                if (attributeUpdate) {
                    query = query.concat(
                        'UPDATE credit_card SET ',
                        attributeUpdate.slice(0, -1),
                        ` WHERE name = '${name}'`
                    )
                    client.query(query, err => {
                        shouldAbort(err)
                        nextCall()
                    })
                }
            }
        }
        
        //Update publisher phone number
        const updatePubPhone = nextCall => {
            if (action === "add" && numbers) {
                client.query(
                    {
                        text: 
                            `INSERT INTO pub_phone_number(
                                name, 
                                number
                            ) VALUES($1, $2)`,
                        values: [
                            newName,
                            numbers
                        ]
                    }
                    , err => {
                        shouldAbort(err)
                        nextCall()
                    }
                )
            } else if (action === "edit" && numbers) {
                client.query(
                    `UPDATE pub_phone_number 
                    SET 
                        number = ${numbers}
                    WHERE name = '${newName || name}'`,
                    err => {
                        shouldAbort(err)
                        nextCall()
                    }
                )
            }
        }
        
        //The actual transaction
        client.query('BEGIN', err => {
            shouldAbort(err)
            updatePublisher(updatePubPhone(() => {
                client.query('COMMIT', err => {
                    shouldAbort(err)
                    payload.send({ success: true })
                })
            ))
        }
    })
    return router
}
