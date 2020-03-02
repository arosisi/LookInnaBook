import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Jumbotron from "react-bootstrap/Jumbotron";

import TwoActionDialog from "../TwoActionDialog";
import { getCurrencyString } from "../../helpers";

class SummaryBox extends React.Component {
  state = { showRequireLogin: false };

  handleCheckOut = () => {
    const { context } = this.props;
    if (!context.user) {
      this.setState({ showRequireLogin: true });
    } else {
      context.redirect("checkout");
    }
  };

  render() {
    const { context } = this.props;
    const { showRequireLogin } = this.state;
    const { cart } = context;
    const subTotal = cart.reduce(
      (sum, item) => sum + item.addedToCart * item.book.price,
      0
    );
    const tax = subTotal * 0.08;
    const shipping = 10;
    const total = subTotal + tax + shipping;
    return cart.length === 0 ? null : (
      <Jumbotron style={{ padding: "1.5rem" }}>
        {cart.map(item => (
          <div key={item.book.isbn}>
            <Row>
              <Col xs={7}>
                <p style={{ fontSize: 15, margin: 0 }}>{item.book.title}</p>
              </Col>
              <Col xs={5}>
                <p style={{ fontSize: 15, margin: 0 }}>{`${
                  item.addedToCart
                } x ${getCurrencyString(item.book.price)} = ${getCurrencyString(
                  item.addedToCart * item.book.price
                )}`}</p>
              </Col>
            </Row>
            <hr />
          </div>
        ))}

        <Row>
          <Col xs={7}>Subtotal</Col>
          <Col xs={5}>{getCurrencyString(subTotal)}</Col>
        </Row>
        <Row>
          <Col xs={7}>Tax</Col>
          <Col xs={5}>{getCurrencyString(tax)}</Col>
        </Row>
        <Row>
          <Col xs={7}>Shipping</Col>
          <Col xs={5}>{getCurrencyString(shipping)}</Col>
        </Row>
        <hr />
        <Row>
          <Col xs={7}>Total</Col>
          <Col xs={5}>{getCurrencyString(total)}</Col>
        </Row>

        <Row style={{ justifyContent: "center" }}>
          <Button
            variant='outline-info'
            style={{ marginTop: 30 }}
            onClick={this.handleCheckOut}
          >
            Check Out
          </Button>
        </Row>

        <TwoActionDialog
          show={showRequireLogin}
          message='You need to log in to check out.'
          secondaryAction='Cancel'
          primaryAction='Log In'
          onHide={() => this.setState({ showRequireLogin: false })}
          onSecondaryAction={() => this.setState({ showRequireLogin: false })}
          onPrimaryAction={() => context.redirect("login")}
        />
      </Jumbotron>
    );
  }
}

export default SummaryBox;
