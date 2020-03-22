create table profile (
	u_id serial,
	first_name varchar(50),
	last_name varchar(50),
	password varchar(50),
	address varchar(255),
	email varchar(50),
	role varchar(8),
	card_number numeric(16, 0),
	primary key (u_id)
);

create table cart (
	order_id serial,
	u_id int,
	date varchar(50),
	tax numeric(8, 2),
	subtotal numeric(8, 2),
	confirmed_time varchar(50),
	received_time varchar(50),
	shipped_time varchar(50),
	shipping_cost numeric(8, 2),
	shipping_address varchar(255),
	recipient varchar(100),
	card_number numeric(16, 0),
	primary key (order_id),
	foreign key (u_id) references profile,
    foreign key (card_number) references credit_card_info
);

create table publisher (
	name varchar(50),
	email varchar(50),
	bank_account varchar(30),
	address varchar(255),
	available boolean,
	primary key (name)
);

create table book (
	isbn varchar(13),
	title varchar(100),
	year numeric(4, 0),
	page_count numeric(4, 0),
	description varchar(2000),
	quantity numeric(4, 0),
	threshold numeric(4, 0),
	cost numeric(8, 2),
	price numeric(8, 2),
	cover_url varchar(100),
	available boolean,
	pub_name varchar(50),
	percentage numeric(3, 2),
	primary key (isbn),
	foreign key (pub_name) references publisher (name) on
	update
		cascade
);

create table pub_phone_number (
	name varchar(50),
	number varchar(20),
	primary key (name, number),
	foreign key (name) references publisher on
	update
		cascade
);

create table author (
	isbn varchar(13),
	author varchar(100),
	primary key (isbn, author),
	foreign key (isbn) references book
);

create table cart_book (
	isbn varchar(13),
	order_id int,
	quantity numeric(4, 0),
	primary key (isbn, order_id),
	foreign key (isbn) references book,
	foreign key (order_id) references cart
);

create table genre (
	isbn varchar(13),
	genre varchar(50),
	primary key (isbn, genre),
	foreign key (isbn) references book
);

create table credit_card_info (
	card_number numeric(16, 0),
	expiry_date varchar(20),
	cvv varchar(3),
	billing_address varchar(255),
	holder_name varchar(100),
	primary key (card_number)
);

create table credit_card (
	u_id int,
	card_number numeric(16, 0),
	primary key (u_id, card_number),
	foreign key (u_id) references profile,
	foreign key (card_number) references credit_card_info
);