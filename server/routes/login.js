const router = require("express").Router()

module.exports = client => {
    router.use((req, res) => {
         const { email, password } = req.body || {}
         if (!email || !password) {
             res.send({ success: false, errMessage: "Failed to fetch from database" })
         }
         client.query(
            `SELECT u_id 
            FROM profile 
            WHERE email = ${email} AND 
                  password = ${password} 
            LIMIT 1`,
            err => {
                if (err) {
                    res.send({ success: false, errMessage: "Failed to fetch from database" })
                } else if (res.rows.length < 1) {
                    res.send({ success: false, errMessage: "Couldn't find an user with that email and password" })
                } else {
                    next()
                }
            }
        )
    })
        
    router.post("/", (req, payload) => {
        const { email, password } = req.body
        const userQuery = 
        `SELECT 
            profile.u_id,
            profile.role,
            profile.first_name,
            profile.last_name,
            profile.address,
            profile.email,
            profile.password,
            credit_card_info.card_number,
            credit_card_info.expiry_date,
            credit_card_info.cvv,
            credit_card_info.holder_name,
            credit_card_info.billing_address
        FROM profile, credit_card, credit_card_info 
        WHERE profile.u_id = credit_card.u_id AND
              profile.card_number = credit_card.card_number AND
              credit_card.card_number = credit_card_info.card_number AND
              email = ${email} AND 
              password = ${password}
        LIMIT 1`
        client.query(userQuery, (err, res) => {
            if (err) {
                payload.send({ success: false, errMessage: "Failed to fetch from database" });
            } else {
                payload.send({ success: true, user: res.rows[0] })
            }
        })
    })
    return router
}
