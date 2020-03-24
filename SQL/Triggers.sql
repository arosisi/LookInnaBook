create
or replace function order_book() returns trigger as $body$
declare
    newQuantity integer;

begin
    select
        sum(quantity) + NEW .quantity into newQuantity
    from
        cart_book,
        cart
    where
        cart_book.isbn = NEW .isbn
        AND cart.order_id = cart_book.order_id
        AND to_date(cart.date, 'Month DD YYYY') > now() - interval '1 month';

update
    book
set
    quantity = newQuantity
where
    isbn = NEW .isbn;

return null;

end;

$body$ language PLPGSQL;

create trigger refill_book after
update
    of quantity on book for each row
    when (
        OLD .quantity IS DISTINCT
        FROM
            NEW .quantity
            and NEW .quantity < OLD .threshold
    ) execute procedure order_book();