create table user
	(u_id		    int serial not null,
     first_name     varchar(30),
     last_name      varchar(30),
     password       varchar(20),
     address        varchar(255),
     email          varchar(20),
     role           varchar(8),
	 primary key (u_id)
	);

create table order
	(order_id		    int serial not null,
     date               varchar(10),
     tax                numeric(8,2),
     subtotal           numeric(8,2),
     confirmed_time     varchar(20),
     received_timw      varchar(20),
     shipped_time       varchar(20),
     shipping_cost      numeric(8,2),
     shipping_address   varchar(255),
     recipient          varchar(30),
	 primary key (order_id)
	);    
    
create table book
	(isbn		    varchar(13),
     title          varchar(20),
     year           numeric(4,0),
     page_count     numeric(4,0),
     description    varchar(255),
     quantity       numeric(4,0),
     threshold      numeric(4,0),
     cost           numeric(8,2),
     price          numeric(8,2),
     cover_url      varchar(100),
     available      boolean,
	 primary key (isbn)
	);        
    
create table pub_phone_number
	(name		    varchar(20), 
	 number		    varchar(15),
	 primary key (name, number)
     foreign key (name) references publisher
	);

create table author
	(isbn		    varchar(13),
	 author         varchar(20),
	 primary key (isbn, author),
	 foreign key (isbn) references book
	);

create table order-user
	(u_id		    int,
	 order_id       int,
	 primary key (order_id),
	 foreign key (u_id) references user,
     foreign key (order_id) references order
	);    
    
create table book-order
	(isbn		    varchar(13),
	 order_id       int,
     quantity       numeric(4,0),
	 primary key (isbn),
	 foreign key (isbn) references book,
     foreign key (order_id) references order
	);        

create table book-pub
	(isbn		    varchar(13),
	 percentage     numeric(5,2),
     pub_name       varchar(20),
	 primary key (isbn),
	 foreign key (isbn) references book
	); 

create table publisher
	(name		    varchar(20),
	 email          varchar(30),
     bank_account   varchar(30),
     address        varchar(255),
     available      boolean,
	 primary key (name)
	);     
    
create table genre
	(isbn		    varchar(13),
	 genre          varchar(30),
	 primary key (isbn, genre),
     foreign key (isbn) references book
	);     
    
create table credit_card
	(u_id               int
     card_number        varchar(16,0),
     expiry_date        varchar(20),
     cvv                numeric(3,0),
     billing_address    varchar(255),
     holder_name        varchar(30),
	 primary key (u_id, card_number),
     foreign key (u_id) references user
	);      
