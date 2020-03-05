import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import OrderCard from "./OrderCard";
import withConsumer from "../../withConsumer";

class Orders extends React.Component {
  state = {
    controller: new AbortController(),
    fetching: false,
    orders: []
  };

  componentDidMount() {
    const { context } = this.props;
    const { controller } = this.state;
    if (context.user) {
      this.setState({ fetching: true }, () => {
        fetch("http://localhost:9000/orders", {
          signal: controller.signal,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ u_id: context.user.id })
        })
          .then(response => response.json())
          .then(response => {
            this.setState({
              fetching: false,
              orders: response.orders
            });
          })
          .catch(error =>
            console.log("Unable to connect to API orders.", error)
          );
      });
    }
  }

  componentWillUnmount() {
    this.state.controller.abort();
  }

  render() {
    const { context } = this.props;
    const { fetching, orders } = this.state;
    return (
      <Container style={{ marginTop: 20 }}>
        {fetching ? (
          <Row style={{ justifyContent: "center" }}>
            <Spinner animation='border' variant='primary' />
          </Row>
        ) : (
          orders.map(order => <OrderCard key={order.order_id} order={order} />)
        )}
      </Container>
    );
  }
}

export default withConsumer(Orders);
