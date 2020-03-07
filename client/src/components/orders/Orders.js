import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import * as moment from "moment";

import OrderCard from "./OrderCard";
import withConsumer from "../../withConsumer";
import { db_time_format } from "../../constants";

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
    const { fetching, orders } = this.state;
    const now = moment();
    const currentOrders = orders.filter(order =>
      moment(order.received_time, db_time_format).isAfter(now)
    );
    const pastOrders = orders.filter(order =>
      moment(order.received_time, db_time_format).isSameOrBefore(now)
    );
    return (
      <Container style={{ marginTop: 20 }}>
        {fetching ? (
          <Row style={{ justifyContent: "center" }}>
            <Spinner animation='border' variant='primary' />
          </Row>
        ) : (
          <div>
            <h3 style={{ marginBottom: 15 }}>Current Order(s)</h3>
            {currentOrders.length ? (
              currentOrders.map(order => (
                <OrderCard key={order.order_id} order={order} now={now} />
              ))
            ) : (
              <p>You do not have any current orders.</p>
            )}

            <br />

            <h3 style={{ marginBottom: 15 }}>Past Order(s)</h3>
            {pastOrders.length ? (
              pastOrders.map(order => (
                <OrderCard key={order.order_id} order={order} now={now} />
              ))
            ) : (
              <p>You do not have any past orders.</p>
            )}
          </div>
        )}
      </Container>
    );
  }
}

export default withConsumer(Orders);
