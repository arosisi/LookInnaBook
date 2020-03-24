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
            return
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
                    } else {
                        payload.send({ success: false, errMessage: "Failed to update publisher info" })
                    }
                })
            }
            return !!err
        }
        
        let query = ''
        
        const updatePublisher = nextCall => {
            if (action === 'remove') {
                query = `UPDATE publisher SET available = false WHERE name = '${name}'`
                client.query(query, err => {
                    if (shouldAbort(err)) return
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
                        name,
                        email,
                        bankAccount,
                        address,
                        true
                    ]
                }
                client.query(query, err => {
                    if (shouldAbort(err)) return
                    nextCall()
                })
            } else {
                const attributeUpdate = ''.concat(
                        newName ? `name = '${newName || name}',` : '',
                        email ? `email = '${email}',` : '',
                        bankAccount ? `bank_account = '${bankAccount}',` : '',
                        address ? `address = '${address}',` : ''
                    )
                if (attributeUpdate) {
                    query = query.concat(
                        'UPDATE publisher SET ',
                        attributeUpdate.slice(0, -1),
                        ` WHERE name = '${name}'`
                    )
                    client.query(query, err => {
                        if (shouldAbort(err)) return
                        nextCall()
                    })
                }
            }
        }
        
        //Update publisher phone number
        const updatePubPhone = nextCall => {
            if (numbers) {
                if (action === "add") {
                    client.query(
                        `INSERT INTO pub_phone_number(
                            name, 
                            number
                        ) VALUES(${numbers.map(num => ({ name: name, number: num }))})`
                        , err => {
                            if (shouldAbort(err)) return
                            nextCall()
                        }
                    )
                } else if (action === "edit") {
                    client.query(
                        `DELETE FROM pub_phone_number
                        WHERE name = '${newName || name}'`,
                        err => {
                            if (shouldAbort(err)) return
                            client.query(
                                `INSERT INTO pub_phone_number(
                                    name, 
                                    number
                                ) VALUES(${numbers.map(num => ({ name: newName || name, number: num }))})`
                                , err => {
                                    if (shouldAbort(err)) return
                                    nextCall()
                                }
                            )
                        }
                    )
                } else {
                    client.query(
                        `DELETE FROM pub_phone_number
                        WHERE name = '${name}'`,
                        err => {
                            if (shouldAbort(err)) return
                            nextCall()
                        }
                    )
                }
            } else {
                nextCall()
            }
        }
        
        //The actual transaction
        client.query('BEGIN', err => {
            if (shouldAbort(err)) return
            updatePublisher(() => updatePubPhone(() => {
                client.query('COMMIT', err => {
                    if (shouldAbort(err)) return
                    payload.send({ success: true })
                })
            }))
        })
    })
    return router
}
