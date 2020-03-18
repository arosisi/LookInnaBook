const router = require("express").Router()

module.exports = client => {
    
    router.post("/", (req, payload) => {
        //Check whether request contains a valid userId in body
        const userId = req && req.body && req.body.u_id
        if (!userId) {
            payload.send({ success: false, errMessage: "Couldn't find an user id" })
        } else {
            client.query(`SELECT u_id FROM profile WHERE u_id = ${userId}`, (err, res) => {
                if (err) {
                    payload.send({ success: false, errMessage: "Couldn't find user with given ID" })
                } else if (res.rows.length < 1) {
                    payload.send({ success: false, errMessage: "Couldn't find user with given ID" })
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
        }
      
        //Update user profile info
        const updateProfile = nextCall => {
            attributeUpdate && client.query(
                `UPDATE profile
                SET
                    ${attributeUpdate.slice(0,-1)}
                WHERE u_id = ${u_id}`, (err, res) => {
                shouldAbort(err)
                nextCall()
            })
        }
        
        const updateCard = nextCall => {
            //If none of these attributes were updated, then skip credit card updating
            if (!creditCard && !expiryDate && !cvv && !holderName && !billingAddress) {
                return
            }
            //If updated successfully, query for user's credit card
            const creditCardQuery = `
            SELECT credit_card_info.card_number
            FROM credit_card, profile, credit_card_info
            WHERE credit_card.u_id = ${u_id} AND
                  profile.card_number = credit_card.card_number AND
                  credit_card.card_number = credit_card_info.card_number`
            client.query(creditCardQuery, (err, response) => {
                shouldAbort(err)
                //If found card, then update card
                const cAttributeUpdate = ''.concat(
                    creditCard ? 
                        `
                        credit_card.card_number = ${creditCard}, 
                        credit_card_info.card_number = ${creditCard},
                        profile.card_number = ${creditCard}
                        ` : '',
                    cvv ? `credit_card_info.cvv = '${cvv}',` : '',
                    billingAddress ? `credit_card_info.billing_address = '${billingAddress}',` : '', 
                    holderName ? `credit_card_info.holder_name = '${holderName}',` : '',  
                    expiryDate ? `credit_card_info.expiry_date = '${expiryDate}',` : ''
                )
                //Update profile, credit_card and credit_card_info all at once if card exists
                if (response.rows.length > 0 && cAttributeUpdate) {
                    const creditCardUpdate = `
                    UPDATE credit_card, credit_card_info, profile
                    SET
                        ${cAttributeUpdate.slice(0,-1)} 
                    WHERE credit_card.u_id = ${u_id} AND
                          profile.card_number = credit_card.card_number AND
                          credit_card.card_number = credit_card_info.card_number`
                    client.query(creditCardUpdate, e => {
                        shouldAbort(err)
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
                        shouldAbort(err)
                        client.query(creditCardInsert, err => {
                            shouldAbort(err)
                            nextCall()
                        })
                    })
                }
            })
        }
        
        //The actual transaction
        client.query('BEGIN', err => {
            shouldAbort(err)
            updateProfile(() => updateCard(() => {
                client.query('COMMIT', err => {
                    shouldAbort(err)
                    payload.send({ success: true })
                })
            }))
        })
    })
    return router
}
