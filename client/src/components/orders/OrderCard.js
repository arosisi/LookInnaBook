import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";
import * as moment from "moment";
import { GoArrowRight } from "react-icons/go";

import OneActionDialog from "../OneActionDialog";
import { getCurrencyString } from "../../helpers";
import { db_time_format, time_format } from "../../constants";

class OrderCard extends React.Component {
  state = { showTracking: false };

  getTimeMessage = (time, now) => {
    if (moment(time, db_time_format).isSameOrBefore(now)) {
      return moment(time, db_time_format).format(time_format);
    }
    return "To be updated...";
  };

  renderTrackingTimes = (
    { confirmed_time, shipped_time, received_time },
    now
  ) => (
    <Row
      style={{
        margin: "15px 0 25px 0",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <Jumbotron
        style={{ width: 200, margin: 0, padding: "1rem", textAlign: "center" }}
      >
        Order Confirmed
        <br />
        {this.getTimeMessage(confirmed_time)}
      </Jumbotron>

      <GoArrowRight size={42} />

      <Jumbotron
        style={{ width: 200, margin: 0, padding: "1rem", textAlign: "center" }}
      >
        Order Shipped
        <br />
        {this.getTimeMessage(shipped_time)}
      </Jumbotron>

      <GoArrowRight size={42} />

      <Jumbotron
        style={{ width: 200, margin: 0, padding: "1rem", textAlign: "center" }}
      >
        Order Received
        <br />
        {this.getTimeMessage(received_time)}
      </Jumbotron>
    </Row>
  );

  render() {
    const { order, now } = this.props;
    const { showTracking } = this.state;
    const subTotal = order.books.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const total = subTotal + order.tax + order.shipping_cost;
    return (
      <Jumbotron style={{ padding: "2.5rem", marginBottom: 15 }}>
        <Row style={{ justifyContent: "space-between" }}>
          <Col>
            <p style={{ margin: 0 }}>{<strong>#{order.order_id}</strong>}</p>
            <p style={{ marginBottom: 25 }}>
              {
                <strong>
                  {moment(order.date, db_time_format).format(time_format)}
                </strong>
              }
            </p>
          </Col>
          <Button
            variant='link'
            style={{ height: "1rem", paddingTop: 0 }}
            onClick={() => this.setState({ showTracking: true })}
          >
            Track My Order
          </Button>
        </Row>

        {order.books.map(item => (
          <div key={item.isbn}>
            <Row>
              <Col xs={7}>
                <p style={{ margin: 0 }}>{item.title}</p>
              </Col>
              <Col xs={5}>
                <p style={{ margin: 0 }}>{`${
                  item.quantity
                } x ${getCurrencyString(item.price)} = ${getCurrencyString(
                  item.quantity * item.price
                )}`}</p>
              </Col>
            </Row>
          </div>
        ))}

        <hr />

        <Row>
          <Col xs={7}>Subtotal</Col>
          <Col xs={5}>{getCurrencyString(subTotal)}</Col>
        </Row>
        <Row>
          <Col xs={7}>Tax</Col>
          <Col xs={5}>{getCurrencyString(order.tax)}</Col>
        </Row>
        <Row>
          <Col xs={7}>Shipping</Col>
          <Col xs={5}>{getCurrencyString(order.shipping_cost)}</Col>
        </Row>
        <hr />
        <Row>
          <Col xs={7}>Total</Col>
          <Col xs={5}>{getCurrencyString(total)}</Col>
        </Row>

        <OneActionDialog
          show={showTracking}
          size='lg'
          content={this.renderTrackingTimes(order, now)}
          action='Close'
          onHide={() => this.setState({ showTracking: false })}
          onAction={() => this.setState({ showTracking: false })}
        />
      </Jumbotron>
    );
  }
}

export default OrderCard;
