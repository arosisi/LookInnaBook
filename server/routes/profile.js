const router = require("express").Router()

module.exports = client => {
    //Check whether request contains a valid userId in body
    router.use((req, res) => {
        const userId = req && req.body && req.body.u_id
        if (!userId) {
            res.send({ success: false, errMessage: "Couldn't find an user id" })
        }
        client.query(`SELECT u_id FROM user WHERE u_id = ${userId}`, (err, response) => {
            if (err) {
                response.send({ success: false, errMessage: "Couldn't find user with given ID" })
            } else if (res.rows.length < 1) {
                response.send({ success: false, errMessage: "Couldn't find user with given ID" })
            } else {
                next()
            }
        })
    })
    
    router.post("/", (req, res) => {
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
        
        const userUpdate = `
        UPDATE user
        SET
            firstName = ${firstName}
            lastName = ${lastName}
            address = ${address}
            email = ${email}
            password = ${password}
        WHERE u_id = ${u_id}`
        
        const creditCardQuery = `
        SELECT *
        FROM credit_card, user
        WHERE credit_card.u_id = ${u_id} AND
              user.card_number = credit_card.card_number`
        
        const creditCardUpdate = `
        UPDATE credit_card
        SET
            card_number = ${creditCard}
            cvv = ${cvv}
            billing_address = ${billingAddress}
            holder_name = ${holderName}
            expiry_date = ${expiryDate}
        WHERE u_id = ${u_id}`
        
        const creditCardInsert = `
        INSERT INTO credit_card (u_id, card_number, expiry_date, cvv, billing_address, holder_name)
        VALUES (${u_id}, ${creditCard}, ${expiryDate}, ${cvv}, ${billingAddress}, ${holderName})`
        
        //Update user profile info
        client.query(userUpdate, (err, res) => {
            if (err) {
                res.send({ success: false, errMessage: "Failed to update user database"  })
            } else {
                //If updated successfully, query for user's credit card
                client.query(creditCardQuery, error => {
                    if (error) {
                        res.send({ success: false, errMessage: "Failed to update user database"  })
                    } else {
                        //If found card, then update card
                        if (response.rows.length > 0) {
                            client.query(creditCardUpdate, e => {
                                if (e) {
                                    res.send({ success: false, errMessage: "Failed to update user database"  })
                                } else {
                                    res.send({ success: true })
                                }
                            }
                        } else {
                            //else insert new card into db
                            client.query(creditCardUpdate, e => {
                                if (e) {
                                    res.send({ success: false, errMessage: "Failed to update user database"  })
                                } else {
                                    res.send({ success: true })
                                }
                            }
                        }
                    }
                })
            }
        })
    })
    return router
}
