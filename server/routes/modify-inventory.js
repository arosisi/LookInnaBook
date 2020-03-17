const router = require("express").Router()
const nodemailer = require("nodemailer");
const moment = require("moment")

const config = require("../config");

module.exports = client => {
  
    router.post("/", (req, payload) => {
        //Check whether request contains an action
        const action = req && req.body && req.body.action
        if (!action) {
            payload.send({ success: false, errMessage: "Couldn't find a valid action" })
        }
        
        const {
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
        
        const shouldAbort = err => {
            if (err) {
                console.error('Error in transaction', err.stack)
                client.query('ROLLBACK', err => {
                    if (err) {
                        payload.send({ success: false, errMessage: "Something went very wrong" })
                    }
                })
                payload.send({ success: false, errMessage: "Failed to update book info" })
            }
        }
        
        let query = ''
        
        const updateBookInfo = nextCall => {
            if (action === 'remove') {
                query = `UPDATE book SET available = false WHERE isbn = '${isbn}'`
                client.query(query, err => {
                    shouldAbort(err)
                    nextCall()
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
                        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
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
                        percentage,
                        true
                    ]
                }
                client.query(query, err => {
                    shouldAbort(err)
                    nextCall()
                })
            } else {
                const attributeUpdate = ''.concat(
                        title ? `title = '${title}',` : '',
                        year ? `year = ${year},` : '',
                        description ? `description = '${description}',` : '', 
                        pageCount ? `page_count = ${pageCount},` : '',  
                        coverUrl ? `cover_url = '${coverUrl}',` : '', 
                        cost ? `cost = ${cost},` : '', 
                        price ? `price = ${price},` : '', 
                        quantity ? `quantity = ${quantity},` : '', 
                        threshold ? `threshold = ${threshold},` : '',
                        quantity ? `quantity = ${quantity},` : '', 
                        threshold ? `threshold = ${threshold},` : '',
                        publisher ? `pub_name = '${publisher}',` : '', 
                        percentage ? `percentage = ${percentage},` : ''
                    )
                if (attributeUpdate) {
                    query = query.concat(
                        'UPDATE book SET ',
                        attributeUpdate.slice(0, -1), //Remove the ending colon in the query string
                        ` WHERE isbn = '${isbn}'`
                    )
                    client.query(query, err => {
                        shouldAbort(err)
                        nextCall()
                    })
                }
            }
        }
        
        //Update the book's genres
        const updateGenre = nextCall => {
            if (genres) {
                //First remove all the genres associated with the book
                const deleteQuery = `DELETE from genre WHERE isbn = '${isbn}'`
                client.query(deleteQuery, err => {
                    shouldAbort(err)
                    //Add list of genres
                    let updateQuery = 'INSERT INTO genre (isbn, genre) VALUES '
                    for (const genre of genres) {
                        updateQuery += `(${isbn}, ${genre}),`
                    }
                    client.query(updateQuery.slice(0,-1), err => {
                        shouldAbort(err)
                        nextCall()
                    })
                })
            } else {
                nextCall()
            }
        }
        
        //Update the book's authors
        const updateAuthor = nextCall => {
            if (authors) {
                //First remove all the authors associated with the book
                const deleteQuery = `DELETE from author WHERE isbn = '${isbn}'`
                client.query(deleteQuery, err => {
                    shouldAbort(err)
                    //Add list of authors
                    let updateQuery = 'INSERT INTO author (isbn, author) VALUES '
                    for (const author of authors) {
                        updateQuery += `(${isbn}, ${genre}),`
                    }
                    client.query(updateQuery.slice(0,-1), err => {
                        shouldAbort(err)
                        nextCall()
                    })
                })
            } else {
                nextCall()
            }
        }
        
        //The actual transaction
        client.query('BEGIN', err => {
            shouldAbort(err)
            updateBookInfo(updateGenre(updateAuthor(() => {
                client.query('COMMIT', err => {
                    shouldAbort(err)
                    payload.send({ success: true })
                })
            )))
        }
    })
    return router
}
