import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

import withConsumer from "../withConsumer";

import inventory from "../collections/inventory"; // eslint-disable-line
import books from "../collections/books"; // eslint-disable-line
import book from "../tables/book"; // eslint-disable-line
import book_pub from "../tables/book_pub"; // eslint-disable-line
import genre from "../tables/genre"; // eslint-disable-line
import filters from "../filters"; // eslint-disable-line
import author from "../tables/author"; // eslint-disable-line
import publisher from "../tables/publisher"; // eslint-disable-line
import publishers from "../collections/publishers"; // eslint-disable-line
import pub_phone_number from "../tables/pub_phone_number"; // eslint-disable-line

class NavigationBar extends React.Component {
  injectEscape = string => string.replace(/'/g, "\\'");

  test = () => {
    let dml = "";
    genre.forEach(item => {
      dml += "insert into genre values (";
      dml += `'${item.isbn}', `;
      dml += `E'${this.injectEscape(item.genre)}'`;
      dml += ");\n";
    });
    console.log(dml);
  };

  getCartCount = () => {
    const { context } = this.props;
    return context.cart.reduce((count, item) => count + item.addedToCart, 0);
  };

  render() {
    const { context } = this.props;
    const cartCount = this.getCartCount();
    return (
      <Navbar bg='light'>
        <Navbar.Brand
          href='/catalogue'
          onClick={event => {
            event.preventDefault();
            context.redirect("catalogue");
          }}
        >
          Look Inna Book
        </Navbar.Brand>

        <Nav className='ml-auto'>
          {context.user ? (
            <NavDropdown
              title={`Hello ${context.user.firstName} `}
              id='basic-nav-dropdown'
            >
              <NavDropdown.Item
                href='profile'
                onClick={event => {
                  event.preventDefault();
                  context.redirect("profile");
                }}
              >
                My Profile
              </NavDropdown.Item>
              <NavDropdown.Item
                href='orders'
                onClick={event => {
                  event.preventDefault();
                  context.redirect("orders");
                }}
              >
                My Orders
              </NavDropdown.Item>
              {context.isOwner() && (
                <NavDropdown.Item
                  href='inventory'
                  onClick={event => {
                    event.preventDefault();
                    context.redirect("inventory");
                  }}
                >
                  Inventory
                </NavDropdown.Item>
              )}
              {context.isOwner() && (
                <NavDropdown.Item
                  href='sales-reports'
                  onClick={event => {
                    event.preventDefault();
                    context.redirect("sales-reports");
                  }}
                >
                  Sales Reports
                </NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <Button
                variant='link'
                style={{ marginLeft: 10 }}
                onClick={() => context.logOut()}
              >
                Log Out
              </Button>
            </NavDropdown>
          ) : (
            <Button variant='link' onClick={() => context.redirect("login")}>
              Log In
            </Button>
          )}

          {!context.user && (
            <Button
              variant='link'
              onClick={() => context.redirect("registration")}
            >
              Register
            </Button>
          )}

          <Row style={{ margin: 0, alignItems: "center" }}>
            <Button variant='link' onClick={() => context.redirect("cart")}>
              Cart
            </Button>
            <Badge
              pill
              variant='info'
              style={{ height: 20, margin: "0 10px 0 -8px" }}
            >
              {cartCount}
            </Badge>
          </Row>

          <Button variant='link' onClick={() => context.redirect("catalogue")}>
            Catalogue
          </Button>

          <Button
            variant='link'
            // onClick={() => console.log(JSON.stringify(context.cart))}
            onClick={() => this.test()}
          >
            Test
          </Button>
        </Nav>
      </Navbar>
    );
  }
}

export default withConsumer(NavigationBar);
