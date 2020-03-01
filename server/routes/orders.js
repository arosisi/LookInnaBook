const router = require("express").Router();

module.exports = client => {
  router.get("/", (req, res) => {
    const userId = req.body.u_id;
    const query = `
        SELECT 
              order.order_id,
              order.date,
              book-order.isbn,
              book-order.quantity
              book.title,
              book.price,
              order.tax,
              order.shipping_cost,
              order.confirmed_time,
              order.shipped_time,
              order.received_time
        FROM order-user, order, book-order, order
        WHERE order-user.u_id = ${userId} AND
              order-user.order_id = order.order_id AND
              order.order_id = book-order.order_id AND
              book-order.isbn = book.isbn`
    client.query(query, (err, response) => {
        if (err) {
            response.send({ success: false });
        } else {
            const orders = [];
            const currentOrder = {};
            const includedBooks = [];
            res.rows.forEach(row => {
                if (!currentOrder) {
                    const { isbn, quantity, title, price, ...other } = row;
                    includedBooks.push(isbn);
                    currentOrder = { ...other, books: [{ isbn, quantity, title, price }] };
                } else if (currentOrder.order_id !== row.order_id) {
                    orders.push(currentOrder);
                    const { isbn, quantity, title, price, ...other } = row;
                    includedBooks = [isbn];
                    currentOrder = { ...other, books: [{ isbn, quantity, title, price }] };
                } else {
                    if (includedBooks.indexOf(row.isbn) < 0) {
                        includedBooks.push(row.isbn);
                        currentOrder.books.push({ 
                            isbn: row.isbn, 
                            quantity: row.quantity, 
                            title: row.title, 
                            price: row.price 
                        });
                    }
                }
            })
            response.send({ success: true, books });
        }
    });
  });
  return router;
};
