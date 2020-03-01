const router = require("express").Router();

module.exports = client => {
  router.get("/", (req, res) => {
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
    client.query(query, (err, response) => {
        if (err) {
            response.send({ success: false });
        } else {
            const publishers = [];
            const currentPub = {};
            res.rows.forEach(row => {
                if (!currentPub) {
                    const { number, ...other } = row;
                    currentBook = { ...other, numbers: [number] };
                } else if (currentPub.name !== row.name) {
                    publishers.push(currentPub);
                    const { number, ...other } = row;
                    currentBook = { ...other, numbers: [number] };
                } else {
                    if (currentPub.numbers.indexOf(row.number) < 0) {
                        currentPub.numbers.push(row.number);
                    }
                }
            })
            response.send({ success: true, publishers });
        }
    });
  });
  return router;
};
