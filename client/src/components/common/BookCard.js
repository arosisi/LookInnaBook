import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class BookCard extends React.Component {
  getAlreadyAddedCount = book => {
    const { context } = this.props;
    let count = 0;
    context.cart.forEach(item => {
      if (item.book.isbn === book.isbn) {
        count = item.addedToCart;
      }
    });
    return count;
  };

  getLabel = count => (count === 1 ? "copy" : "copies");

  render() {
    const { book, children } = this.props;
    const alreadyAddedCount = this.getAlreadyAddedCount(book);
    return (
      <Card key={book.isbn} body style={{ marginBottom: 10 }}>
        <Row>
          <Col xs={2}>
            <img src={book.cover_url} alt='cover' width='100%' />
          </Col>
          <Col>
            <Row
              style={{
                margin: 0,
                alignItems: "baseline",
                justifyContent: "space-between"
              }}
            >
              <h5>{book.title}</h5>
              <Row style={{ margin: 0 }}>{children}</Row>
            </Row>

            <Row
              style={{
                margin: 0,
                alignItems: "baseline",
                justifyContent: "space-between"
              }}
            >
              <h6>{book.authors.join(", ")}</h6>
              <p
                style={{
                  marginBottom: 8,
                  fontSize: 11,
                  fontWeight: 500,
                  background:
                    book.quantity < alreadyAddedCount ? "yellow" : "none"
                }}
              >
                {book.quantity < 10 &&
                  `Only ${book.quantity} ${this.getLabel(
                    book.quantity
                  )} left. `}
                {`${alreadyAddedCount} ${this.getLabel(
                  alreadyAddedCount
                )} in cart.`}
              </p>
            </Row>

            <p style={{ marginBottom: 10 }}>{book.description}</p>

            <p style={{ margin: 0, fontWeight: 500 }}>
              {book.price.toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD"
              })}
            </p>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default BookCard;
