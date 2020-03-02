const router = require("express").Router()

module.exports = client => {
    router.use((req, res) => {
         const { email, password } = req.body || {}
         if (!email || !password) {
             res.send({ success: false, errMessage: "Failed to fetch from database" })
         }
         client.query(
            `SELECT u_id 
            FROM user 
            WHERE email = ${email} AND 
                  password = ${password} 
            LIMIT 1`,
            (err, res) => {
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
        
    router.post("/", (req, res) => {
        const { email, password } = req.body
        const userQuery = 
        `SELECT 
            user.u_id,
            user.role,
            user.first_name,
            user.last_name,
            user.address,
            user.email,
            user.password,
            credit_card.card_number,
            credit_card.expiry_date,
            credit_card.cvv,
            credit_card.holder_name,
            credit_card.billing_address
        FROM user, credit_card 
        WHERE user.u_id = credit_card.u_id
              email = ${email} AND 
              password = ${password} 
        LIMIT 1`
        client.query(userQuery, (err, response) => {
            if (err) {
                res.send({ success: false, errMessage: "Failed to fetch from database" });
            } else {
                res.send({ success: true, user: res.rows[0]
            }
        })
    })
    return router
}
