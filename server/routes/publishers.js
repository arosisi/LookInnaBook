const router = require("express").Router()

module.exports = client => {
    router.get("/", (req, payload) => {
        const query = `
        SELECT 
              publisher.available,
              pub_phone_number.number,
              publisher.bank_account,
              publisher.email,
              publisher.address,
              publisher.name
        FROM publisher, pub_phone_number
        WHERE publisher.name = pub_phone_number.name`
        client.query(query, (err, res) => {
            if (err) {
                payload.send({ success: false, errMessage: "Failed to fetch from database"  })
            } else {
                const publishers = []
                const currentPub = {}
                res.rows.forEach(row => {
                    if (!currentPub) {
                        const { number, ...other } = row
                        currentBook = { ...other, numbers: [number] }
                    } else if (currentPub.name !== row.name) {
                        publishers.push(currentPub)
                        const { number, ...other } = row
                        currentBook = { ...other, numbers: [number] }
                    } else {
                        if (currentPub.numbers.indexOf(row.number) < 0) {
                            currentPub.numbers.push(row.number)
                        }
                    }
                })
                payload.send({ success: true, publishers })
            }
        })
    })
    return router
}
