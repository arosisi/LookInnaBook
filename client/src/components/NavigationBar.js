import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

import withConsumer from "../withConsumer";

class NavigationBar extends React.Component {
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
                  href='reports'
                  onClick={event => {
                    event.preventDefault();
                    context.redirect("reports");
                  }}
                >
                  Reports
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
        </Nav>
      </Navbar>
    );
  }
}

export default withConsumer(NavigationBar);
