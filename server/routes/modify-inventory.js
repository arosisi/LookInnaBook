const router = require("express").Router()
const nodemailer = require("nodemailer");
const moment = require("moment")

const config = require("../config");

module.exports = client => {
    
    //Check whether request contains an action
    router.use((req, res) => {
        const action = req && req.body && req.body.action
        if (!action) {
            res.send({ success: false, errMessage: "Couldn't find a valid action" })
        }
        next()
    })
  
    router.post("/", (req, payload) => {
        
        const { 
            action, 
            isbn, 
            title, 
            authors, 
            year, 
            genres, 
            description, 
            pageCount, 
            coverUrl, 
            cost, 
            price, 
            quantity, 
            threshold, 
            publisher, 
            percentage
        } = req.body
        
        let query = ''
        
        if (action === 'remove') {
            query = `UPDATE book SET available = false WHERE isbn = ${isbn}`
            client.query(query, (err, res) => {
                if (err) {
                    payload.send({ success: false, errMessage: "Failed to update book info" })
                }
            })
        } else if (action === 'add' ) {
            query = {
                text: 
                    `INSERT INTO book(
                        isbn, 
                        title,
                        year,
                        description, 
                        page_count, 
                        cover_url, 
                        cost, 
                        price, 
                        quantity, 
                        threshold,
                        pub_name,
                        percentage,
                        available
                    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)`,
                values: [
                    isbn, 
                    title, 
                    year, 
                    description, 
                    pageCount, 
                    coverUrl, 
                    cost, 
                    price, 
                    quantity, 
                    threshold,
                    publisher,
                    percentage
                ]
            }
            client.query(query, (err, res) => {
                if (err) {
                    payload.send({ success: false, errMessage: "Failed to update book info" })
                }
            })
        } else {
            const attributeUpdate = ''.concat(
                    title ? `title = ${title},` : '',
                    year ? `year = ${year},` : '',
                    description ? `description = ${description},` : '', 
                    pageCount ? `page_count = ${pageCount},` : '',  
                    coverUrl ? `cover_url = ${coverUrl},` : '', 
                    cost ? `cost = ${cost},` : '', 
                    price ? `price = ${price},` : '', 
                    quantity ? `quantity = ${quantity},` : '', 
                    threshold ? `threshold = ${threshold},` : '',
                    quantity ? `quantity = ${quantity},` : '', 
                    threshold ? `threshold = ${threshold},` : '',
                    publisher ? `pub_name = ${publisher},` : '', 
                    percentage ? `percentage = ${percentage},` : ''
                )
            if (attributeUpdate) {
                query = query.concat(
                    'UPDATE book SET ',
                    attributeUpdate.slice(0, -1), //Remove the ending colon in the query string
                    ` WHERE isbn = ${isbn}`
                )
                client.query(query, (err, res) => {
                    if (err) {
                        payload.send({ success: false, errMessage: "Failed to update book info" })
                    }
                })
            }
        }
        
        //Update the book's genres
        if (genres) {
            //First remove all the genres associated with the book
            const deleteQuery = `DELETE from genre WHERE isbn = ${isbn}`
            client.query(deleteQuery, (err, res) => {
                if (err) {
                    payload.send({ success: false, errMessage: "Failed to update book info" })
                } else {
                    //Add list of genres
                    let updateQuery = 'INSERT INTO genre (isbn, genre) VALUES '
                    for (const genre of genres) {
                        updateQuery += `(${isbn}, ${genre})`
                    }
                    client.query(updateQuery, e => {
                        if (e) {
                            payload.send({ success: false, errMessage: "Failed to update book info" })
                        }
                    })
                }
            })
        }
        
        //Update the book's authors
        if (authors) {
            //First remove all the authors associated with the book
            const deleteQuery = `DELETE from author WHERE isbn = ${isbn}`
            client.query(deleteQuery, (err, res) => {
                if (err) {
                    payload.send({ success: false, errMessage: "Failed to update book info" })
                } else {
                    //Add list of authors
                    let updateQuery = 'INSERT INTO author (isbn, author) VALUES '
                    for (const author of authors) {
                        updateQuery += `(${isbn}, ${genre})`
                    }
                    client.query(updateQuery, e => {
                        if (e) {
                            payload.send({ success: false, errMessage: "Failed to update book info" })
                        }
                    })
                }
            })
        }
        payload.send({ success: true })
    })
    return router
}
