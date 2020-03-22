const router = require("express").Router()

module.exports = client => {
    
    router.post("/", (req, payload) => {
        //Check whether request contains a valid userId in body
        const userId = req && req.body && req.body.id
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
            if (!creditCard) {
                nextCall()
            }
            //If card is present insert new card into db. All info are assumed to be present
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
