const router = require("express").Router()
const nodemailer = require("nodemailer");

const config = require("../config");

module.exports = client => {
    router.post("/", (req, payload) => {
        
        //Check whether request contains a valid email in body
        const email = req && req.body && req.body.email
        if (!email) {
            payload.send({ success: false, errMessage: "Couldn't find a valid email" })
        }
        
        const query = `
        SELECT password
        FROM profile
        WHERE email = ${email}`
        
        client.query(query, (err, res) => {
            if (err || res.rows.length < 1) {
                payload.send({ success: false, errMessage: "Couldn't find user with given email" })
            } else {
                const { password } = res.rows[0]
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    port: 25,
                    secure: false,
                    auth: {
                      user: config.gmailEmail,
                      pass: config.gmailPassword
                    },
                    tls: {
                      rejectUnauthorized: false
                    }
                })

                const message = {
                    from: "Look Inna Book <comp3005project.lookinnabook@gmail.com>",
                    to: email,
                    subject: `${_.capitalize("Forgot Password")} Look Inna Book Password`,
                    html: `<p>Hello,</p><p>Your password is ${password}.</p>`
                }

                transporter.sendMail(message, (err, info) => {
                    if (err) {
                      console.log("Error occurred. " + err.message);
                      res.send({
                        success: false,
                        message: "Unable to send verification email."
                      });
                    } else {
                      console.log("Message sent: %s", info.messageId);
                      payload.send({ success: true });
                    }
                })
            }
        })
        
    })
    return router
}
