import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import PaymentForm from "./PaymentForm";
import Success from "./Success";
import SummaryBox from "../common/SummaryBox";
import { getAmountsToPay } from "../../helpers";
import withConsumer from "../../withConsumer";

class Checkout extends React.Component {
  state = {
    submitting: false,
    success: false,
    orderId: null,
    showAlert: false,
    alertMessage: ""
  };

  handleSubmit = values => {
    const { context } = this.props;
    const { cart } = context;
    const books = cart.map(item => ({
      isbn: item.book.isbn,
      quantity: item.addedToCart,
      price: item.book.price
    }));
    const { subTotal, tax, shipping } = getAmountsToPay(cart);
    const summary = { books, subTotal, tax, shipping };
    this.setState({ submitting: true }, () =>
      fetch("http://localhost:9000/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...summary, ...values })
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            this.setState(
              {
                submitting: false,
                success: true,
                orderId: response.order.order_id
              },
              () => context.clearCart()
            );
          } else {
            this.setState({
              submitting: false,
              showAlert: true,
              alertMessage:
                response.errCode === 1
                  ? "Invalid credit card."
                  : response.errCode === 2
                  ? `"${response.title}" is too low in stock.`
                  : response.errCode === 3
                  ? `"${response.title}" was removed from the store.`
                  : "Unable to process transaction."
            });
            console.log(response.errMessage);
          }
        })
        .catch(error => console.log("Unable to connect to API payment.", error))
    );
  };

  render() {
    const { context } = this.props;
    const {
      submitting,
      success,
      orderId,
      showAlert,
      alertMessage
    } = this.state;
    return (
      <div style={{ margin: 20 }}>
        <Row style={{ marginTop: 20 }}>
          {success ? (
            <Success context={context} orderId={orderId} />
          ) : (
            <>
              {/* Summary box */}
              <Col xs='3'>
                <SummaryBox context={context} checkingOut={true} />
              </Col>

              {/* Payment div */}
              <Col xs='9'>
                <Container style={{ width: 550 }}>
                  <PaymentForm
                    context={context}
                    onSubmit={this.handleSubmit}
                    onCloseAlert={() => this.setState({ showAlert: false })}
                    submitting={submitting}
                    showAlert={showAlert}
                    alertMessage={alertMessage}
                  />
                </Container>
              </Col>
            </>
          )}
        </Row>
      </div>
    );
  }
}

export default withConsumer(Checkout);
