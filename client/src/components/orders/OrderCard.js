import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

import AppToolTip from "../../AppToolTip";
import { truncateText, getCurrencyString } from "../../helpers";

class OrderCard extends React.Component {
  render() {
    const { order } = this.props;
    return (
      <Card
        key={order.order_id}
        body
        style={{ padding: "1rem", marginBottom: 10 }}
      >
        <p style={{ margin: 0 }}>{<strong>#{order.order_id}</strong>}</p>
        <p style={{ marginBottom: 25 }}>{<strong>{order.date}</strong>}</p>

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
          <Col xs={5}>{getCurrencyString(99999)}</Col>
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
          <Col xs={5}>{getCurrencyString(99999)}</Col>
        </Row>
      </Card>
    );
  }
}

export default OrderCard;
