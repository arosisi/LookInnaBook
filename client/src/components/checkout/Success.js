import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";

class Success extends React.Component {
  render() {
    const { context, orderId } = this.props;
    return (
      <Container style={{ width: 550 }}>
        <Jumbotron style={{ padding: "1.5rem 2rem" }}>
          <p style={{ marginBottom: 0 }}>
            Your order number is <strong>#{orderId}</strong>.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            You can track your order in <strong>My Orders</strong>.
          </p>
          <Row style={{ margin: 0, justifyContent: "flex-end" }}>
            <Button
              variant='secondary'
              onClick={() => context.redirect("catalogue")}
            >
              Catalogue
            </Button>
            <Button
              variant='primary'
              style={{ marginLeft: 15 }}
              onClick={() => context.redirect("orders")}
            >
              My Orders
            </Button>
          </Row>
        </Jumbotron>
      </Container>
    );
  }
}

export default Success;
