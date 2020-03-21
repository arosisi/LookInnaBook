const router = require("express").Router()

module.exports = client => {
    
    router.post("/", (req, payload) => {
        //Check whether request contains a valid userId in body
        const userId = req && req.body && req.body.u_id
        if (!userId) {
            payload.send({ success: false, errMessage: "Couldn't find an user id" })
            return
        } else {
            client.query(`SELECT u_id FROM profile WHERE u_id = ${userId}`, (err, res) => {
                if (err) {
                    payload.send({ success: false, errMessage: "Couldn't find user with given ID" })
                    return
                } else if (res.rows.length < 1) {
                    payload.send({ success: false, errMessage: "Couldn't find user with given ID" })
                    return
                }
            })
        }
        
        const { 
            u_id, 
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
                        payload.send({ success: false, errMessage: "Failed to update publisher info" })
                    }
                })
            }
            return !!err
        }
      
        //Update user profile info
        const updateProfile = nextCall => {
            client.query(
                `UPDATE profile
                SET
                    ${attributeUpdate.slice(0,-1)}
                WHERE u_id = ${u_id}`, err => {
                if (shouldAbort(err)) return
                nextCall()
            })
        }
        
        const updateCard = nextCall => {
            //Query for user's credit card
            const creditCardQuery = `
            SELECT credit_card_info.card_number
            FROM credit_card, profile, credit_card_info
            WHERE credit_card.u_id = ${u_id} AND
                  profile.card_number = credit_card.card_number AND
                  credit_card.card_number = credit_card_info.card_number`
            client.query(creditCardQuery, (err, response) => {
                if (shouldAbort(err)) return
                //If found card, then update card
                const cAttributeUpdate = ''.concat(
                    creditCard ? `card_number = ${creditCard},` : '',
                    cvv ? `cvv = '${cvv}',` : '',
                    billingAddress ? `billing_address = '${billingAddress}',` : '', 
                    holderName ? `holder_name = '${holderName}',` : '',  
                    expiryDate ? `expiry_date = '${expiryDate}',` : ''
                )
                //Update profile, credit_card and credit_card_info all at once if card exists
                if (response && response.rows.length > 0 && creditCard) {
                    const creditCardUpdate = `
                    UPDATE credit_card_info
                    SET
                        card_number = ${creditCard},
                        cvv = '${cvv}',
                        billing_address = '${billingAddress}',
                        holder_name = '${holderName}',
                        expiry_date = '${expiryDate}'
                    FROM credit_card
                    WHERE credit_card.u_id = ${u_id} AND
                          credit_card.card_number = credit_card_info.card_number`
                    client.query(creditCardUpdate, err => {
                        if (shouldAbort(err)) return
                        const cardUpdate = 
                           `UPDATE credit_card
                            SET
                                card_number = ${creditCard}
                            FROM profile
                            WHERE profile.card_number = credit_card.card_number AND 
                                  profile.u_id = ${u_id} AND
                                  profile.u_id = credit_card.u_id`
                        client.query(cardUpdate, err => {
                            if (shouldAbort(err)) return
                            const userUpdate =
                                `UPDATE profile
                                SET
                                    card_number = ${creditCard}
                                WHERE u_id = ${u_id}`
                            client.query(userUpdate, err => {
                                if (shouldAbort(err)) return
                            })
                        })
                        nextCall()
                    })
                } else {
                    //Else insert new card into db. All info are assumed to be present
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
                            nextCall()
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
