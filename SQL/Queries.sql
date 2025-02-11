-- ******************Queries in /books******************

-- Query is used to gather all information about all the books in the database
-- Or optionally, info about a list of provided books
SELECT 
    book.percentage as publisher_percentage,
    author.author,
    genre.genre,
    book.pub_name as publisher,
    book.cover_url,
    book.available,
    book.cost,
    book.threshold,
    book.quantity,
    book.price,
    book.title,
    book.isbn,
    book.year,
    book.page_count,
    book.description
FROM author, book, genre
WHERE author.isbn = book.isbn AND
    book.isbn = genre.isbn
    (AND book.isbn IN (...))


-- ******************Queries in /inventory******************

-- Query is used to gather all book information
SELECT 
    book.percentage as publisher_percentage,
    author.author,
    genre.genre,
    book.pub_name as publisher,
    book.cover_url,
    book.available,
    book.cost,
    book.threshold,
    book.quantity,
    book.price,
    book.title,
    book.isbn,
    book.year,
    book.page_count,
    book.description
FROM author, book, genre
WHERE author.isbn = book.isbn AND
    book.isbn = genre.isbn

--    Gather all information about all publishers
SELECT name, available
FROM publisher


-- ******************Queries in /login******************

-- Find one user with the given pair of email-password
SELECT u_id 
FROM profile 
WHERE email = '${email}' AND 
    password = '${password}' 
LIMIT 1

-- Find one user profile + payment info with the given email-password pair
SELECT 
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
    email = '${email}' AND 
    password = '${password}'
LIMIT 1


-- ******************Queries in /modify-inventory******************

-- Query to indicate that a book has been removed from the database
UPDATE book SET available = false WHERE isbn = '${isbn}'

-- query to insert a new book into the database using the provided values
INSERT INTO book(
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
) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)

-- Update a book entry in the database with the provided values
UPDATE book SET
    title = '${title}',
    year = ${year},
    description = '${description}',
    page_count = ${pageCount},
    cover_url = '${coverUrl}',
    cost = ${cost},
    price = ${price},
    quantity = ${quantity},
    threshold = ${threshold},
    pub_name = '${publisher}',
    percentage = ${percentage}
WHERE isbn = '${isbn}'

-- Remove a genre from the db
DELETE from genre WHERE isbn = '${isbn}'

-- Insert one (or many) genre(s) into the db
INSERT INTO genre (isbn, genre) VALUES (...), (...), ...

-- Delete an author from the db
DELETE from author WHERE isbn = '${isbn}'

-- Insert one (or many) author(s) into the db
INSERT INTO author (isbn, author) VALUES (...), (...), ...


-- ******************Queries in /modify-publisher******************

-- Remove a publisher from the db
UPDATE publisher SET available = false WHERE name = '${name}'

-- Insert a new publisher into the db
INSERT INTO publisher(
    name, 
    email, 
    bank_account, 
    address, 
    available
) VALUES($1, $2, $3, $4, $5)

-- Update a publisher's info
UPDATE publisher SET 
    name = '${newName || name}',
    email = '${email}',
    bank_account = '${bankAccount}',
    address = '${address}'
WHERE name = '${name}'

-- Add a publisher's contact phone number(s)
INSERT INTO pub_phone_number(
    name, 
    number
) VALUES (...), (...), ...

-- Delete a publisher's phone number
DELETE FROM pub_phone_number
WHERE name = '${newName || name}'


-- ******************Queries in /orders******************

-- Retrieve all past orders of an user
SELECT 
    cart.order_id,
    cart.date,
    cart_book.isbn,
    cart_book.quantity,
    book.title,
    cart_book.price,
    cart.tax,
    cart.shipping_cost,
    cart.confirmed_time,
    cart.shipped_time,
    cart.received_time,
    cart.card_number
FROM cart, cart_book, book
WHERE cart.u_id = ${userId} AND
    cart.order_id = cart_book.order_id AND
    cart_book.isbn = book.isbn


-- ******************Queries in /payment******************

-- Retrieve all books with given isbns
SELECT isbn, title FROM book WHERE available = false AND isbn IN (..., ...)
SELECT isbn, quantity, title FROM book WHERE available = true AND isbn IN (..., ...)

-- Retrieve a credit card from db
SELECT card_number FROM credit_card_info WHERE card_number = ${parseInt(creditCard)}

-- Retrieve a card that matches the given params
SELECT card_number
FROM credit_card_info
WHERE card_number = ${parseInt(creditCard)} AND
    cvv = '${cvv}' AND
    billing_address = '${billingAddress}' AND
    holder_name = '${holderName}' AND
    expiry_date = '${expiryDate}'

-- check if a given card belongs to an user
SELECT card_number 
FROM credit_card 
WHERE card_number = ${parseInt(creditCard)} AND 
    u_id = ${u_id}
      
-- associate a card with an user
INSERT INTO credit_card(u_id, card_number) VALUES ($1, $2)

-- Insert a new card into the db
INSERT INTO credit_card_info(
    card_number,
    expiry_date,
    cvv,
    billing_address,
    holder_name
) VALUES($1, $2, $3, $4, $5)

-- Insert a new order in the db
INSERT INTO cart(
    u_id,
    date, 
    tax, 
    subtotal, 
    confirmed_time, 
    shipped_time, 
    received_time,
    shipping_cost,
    shipping_address,
    recipient,
    card_number
) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING order_id

-- Insert the content of an order into the db
INSERT INTO cart_book(isbn, order_id, quantity, price) VALUES (...), (...), ...

-- Update the quantity of books left in the store after an order
UPDATE book
SET
    quantity = book2.quantity
FROM (VALUES
    ${newBookQuantity}
) as book2(isbn, quantity)
WHERE book.isbn = book2.isbn


-- ******************Queries in /profile******************

-- Find another user besides current user with same email
SELECT u_id FROM profile WHERE email = '${email}' AND u_id != ${u_id}

-- Update user's profile info
UPDATE profile
SET
    first_name = '${firstName}',
    last_name = '${lastName}',
    address = '${address}', 
    email = '${email}',  
    password = '${password}',
WHERE u_id = ${u_id}

-- Retrieve a credit card from the db
SELECT card_number
FROM credit_card_info
WHERE card_number = ${parseInt(creditCard)}

-- Retrieve a card that matches the given params
SELECT card_number
FROM credit_card_info
WHERE card_number = ${parseInt(creditCard)} AND
    cvv = '${cvv}' AND
    billing_address = '${billingAddress}' AND
    holder_name = '${holderName}' AND
    expiry_date = '${expiryDate}'
      
-- check if a given card belongs to an user      
SELECT card_number 
FROM credit_card 
WHERE card_number = ${parseInt(creditCard)} AND 
    u_id = ${u_id}
      
-- associate a card with an user
INSERT INTO credit_card(u_id, card_number) VALUES ($1, $2)

-- Insert a new card into the db
INSERT INTO credit_card_info(
    card_number,
    expiry_date,
    cvv,
    billing_address,
    holder_name
) VALUES($1, $2, $3, $4, $5)


-- ******************Queries in /publishers******************

-- Retrieve info about all the current publishers (excluding the ones that were removed)
SELECT 
    publisher.available,
    pub_phone_number.number,
    publisher.bank_account,
    publisher.email,
    publisher.address,
    publisher.name
FROM publisher, pub_phone_number
WHERE publisher.name = pub_phone_number.name AND
    publisher.available = true


-- ******************Queries in /reset-password******************

-- Retrieve password of an user with given email
SELECT password
FROM profile
WHERE email = '${email}'


-- ******************Queries in /sales-reports******************

-- Retrieve all books from the db
SELECT isbn, quantity, cost
FROM book

-- Retrieve all orders + orders content
SELECT 
    cart_book.isbn,
    cart_book.quantity,
    cart_book.price
FROM cart, cart_book
WHERE cart.order_id = cart_book.order_id

-- Get all the genres of the books sold
SELECT 
    genre.genre,
    cart_book.isbn,
    cart_book.quantity,
    cart_book.price
FROM cart, cart_book, book, genre
WHERE cart.order_id = cart_book.order_id AND
    cart_book.isbn = book.isbn AND
    book.isbn = genre.isbn
      
-- Get all books sold by their authors
SELECT 
    author.author,
    cart_book.isbn,
    cart_book.quantity,
    cart_book.price
FROM cart, cart_book, book, author
WHERE cart.order_id = cart_book.order_id AND
    cart_book.isbn = book.isbn AND
    book.isbn = author.isbn
      
-- Get all publishers
SELECT name
FROM publisher

-- Get all books sold by their publishers
SELECT 
    cart_book.isbn,
    cart_book.quantity,
    cart_book.price,
    book.pub_name
FROM cart, cart_book, book
WHERE cart.order_id = cart_book.order_id AND
    cart_book.isbn = book.isbn