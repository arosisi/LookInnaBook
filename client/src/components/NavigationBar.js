import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

import withConsumer from "../withConsumer";

import inventory from "../inventory";
import books from "../books";
import book_pub from "../book_pub";
import genre from "../genre";
import author from "../author";
import publisher from "../publisher";
import publishers from "../publishers";
import pub_phone_number from "../pub_phone_number";

class NavigationBar extends React.Component {
  render() {
    const { context } = this.props;
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

          <Button variant='link' onClick={() => context.redirect("cart")}>
            Cart
          </Button>

          <Button variant='link' onClick={() => console.log(context.user)}>
            Console.log(user)
          </Button>

          {/* <Form inline>
            <FormControl type='text' placeholder='Search' className='mr-sm-2' />
            <Button variant='outline-success'>Search</Button>
          </Form> */}
        </Nav>
      </Navbar>
    );
  }
}

export default withConsumer(NavigationBar);
