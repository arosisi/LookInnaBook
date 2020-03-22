const router = require("express").Router()

module.exports = client => {
    
    router.post("/", (req, payload) => {
        //Check whether request contains a valid userId in body
        const userId = req && req.body && req.body.id
        if (!userId) {
            payload.send({ success: false, errMessage: "Couldn't find an user id" })
            return
        }
        
        const { 
            id: u_id, 
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
        } = req.body
        
        const attributeUpdate = ''.concat(
            firstName ? `first_name = '${firstName}',` : '',
            lastName ? `last_name = '${lastName}',` : '',
            address ? `address = '${address}',` : '', 
            email ? `email = '${email}',` : '',  
            password ? `password = '${password}',` : ''
        )
        
        const shouldAbort = err => {
            if (err) {
                console.error('Error in transaction', err.stack)
                client.query('ROLLBACK', err => {
                    if (err) {
                        payload.send({ success: false, errMessage: "Something went very wrong" })
                    } else {
                        payload.send({ success: false, errMessage: "Failed to update user info" })
                    }
                })
            }
            return !!err
        }
      
        //Update user profile info
        const updateProfile = nextCall => {
            client.query(`SELECT u_id FROM profile WHERE email = '${email} AND u_id != ${u_id}'`, (err, res) => {
                if (shouldAbort(err)) return
                //If email already registered by another user => fail
                if (res && res.rows.length > 0) {
                    client.query('ROLLBACK', err => {
                        if (err) {
                            payload.send({ success: false, errMessage: "Something went very wrong" })
                        } else {
                            payload.send({ success: false, errMessage: "Email has already been used", errCode: 1 })
                        }
                    })
                } else {
                    client.query(
                        `UPDATE profile
                        SET
                            ${attributeUpdate.slice(0,-1)}
                        WHERE u_id = ${u_id}`, err => {
                        if (shouldAbort(err)) return
                        nextCall()
                    })
                }
            })
        }
        
        const updateCard = nextCall => {
            if (!creditCard) {
                nextCall()
                return
            }
            const cardQuery = `
                SELECT card_number
                FROM credit_card_info
                WHERE card_number = ${creditCard}`
            //Find an existing card with the same card_number
            client.query(cardQuery, (err, response) => {
                if (shouldAbort(err)) return
                //If theres an existing card with the same card_number
                if (response && response.rows.length > 0) {
                    //Check if card_details also match
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
                            //Check if card is already associated with the user
                            client.query(`SELECT card_number 
                                          FROM credit_card 
                                          WHERE card_number = ${creditCard} AND 
                                                u_id = ${u_id}`, (err, res) => {
                                if (shouldAbort(err)) return
                                //Card already associated => update user main card
                                if (res && res.rows.length > 0) {
                                    const userUpdate =
                                    `UPDATE profile
                                    SET
                                        card_number = ${creditCard}
                                    WHERE u_id = ${u_id}`
                                    client.query(userUpdate, err => {
                                        if (shouldAbort(err)) return
                                        nextCall()
                                    })
                                } else {
                                    //If not associate card with user
                                    const creditCardInsert = 
                                    {
                                        text: 
                                            `INSERT INTO credit_card(u_id, card_number)
                                                    VALUES ($1, $2)`,
                                        values: [
                                            u_id,
                                            creditCard
                                        ]
                                    }
                                    client.query(creditCardInsert, err => {
                                        if (shouldAbort(err)) return
                                        const userUpdate =
                                        `UPDATE profile
                                        SET
                                            card_number = ${creditCard}
                                        WHERE u_id = ${u_id}`
                                        client.query(userUpdate, err => {
                                            if (shouldAbort(err)) return
                                            nextCall()
                                        })
                                    })
                                }
                            })
                        } else {
                            //Details dont match = error
                            client.query('ROLLBACK', err => {
                                if (err) {
                                    payload.send({ success: false, errMessage: "Something went very wrong" })
                                } else {
                                    payload.send({ success: false, errMessage: "Invalid credit card", errCode: 2 })
                                }
                            })
                        }
                    })
                } else {
                    //The new card doesnt exist in database => Insert it + associate with user
                    const creditCardInsert = 
                    {
                        text: 
                            `INSERT INTO credit_card(u_id, card_number)
                                    VALUES ($1, $2)`,
                        values: [
                            u_id,
                            creditCard
                        ]
                    }
                    
                    const creditCardInfoInsert = 
                    {
                        text: 
                            `INSERT INTO credit_card_info(card_number, expiry_date, cvv, billing_address, holder_name)
                            VALUES ($1, $2, $3, $4, $5)`,
                        values: [
                            creditCard,
                            expiryDate,
                            cvv,
                            billingAddress,
                            holderName
                        ]
                    }
                    
                    client.query(creditCardInfoInsert, err => {
                        if (shouldAbort(err)) return
                        client.query(creditCardInsert, err => {
                            if (shouldAbort(err)) return
                            const userUpdate =
                                `UPDATE profile
                                SET
                                    card_number = ${creditCard}
                                WHERE u_id = ${u_id}`
                            client.query(userUpdate, err => {
                                if (shouldAbort(err)) return
                                nextCall()
                            })
                        })
                    })
                }
            })
        }
        
        //The actual transaction
        client.query('BEGIN', err => {
            if (shouldAbort(err)) return
            updateProfile(() => updateCard(() => {
                client.query('COMMIT', err => {
                    if (shouldAbort(err)) return
                    payload.send({ success: true })
                })
            }))
        })
    })
    return router
}
