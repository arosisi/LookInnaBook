import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

import AppToolTip from "../../AppToolTip";
import withConsumer from "../../withConsumer";
import { truncateText, getCurrencyString } from "../../helpers";

class BookCard extends React.Component {
  state = { showAll: false };

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
    const { context, book, children } = this.props;
    const { showAll } = this.state;
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
              {/* Title */}
              <AppToolTip
                disabled={book.title.length <= 45}
                placement='bottom'
                text={book.title}
              >
                <h5>{truncateText(book.title, 45)}</h5>
              </AppToolTip>

              {/* Book actions */}
              <Row style={{ margin: 0 }}>{children}</Row>
            </Row>

            <Row
              style={{
                margin: 0,
                alignItems: "baseline",
                justifyContent: "space-between"
              }}
            >
              {/* Authors */}
              <h6>{book.authors.join(", ")}</h6>

              {/* Stock and In cart counts */}
              <AppToolTip
                disabled={book.quantity >= alreadyAddedCount}
                placement='bottom'
                text={`${
                  context.page === "catalogue"
                    ? "Go to Cart to reduce the quantity."
                    : "Reduce the quantity."
                }`}
              >
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
              </AppToolTip>
            </Row>

            <p style={{ marginBottom: 10 }}>
              {showAll ? book.description : truncateText(book.description, 250)}
            </p>

            {showAll && (
              <p style={{ marginBottom: 0, fontStyle: "italic" }}>
                Genres: {book.genres.join(", ")}
              </p>
            )}

            {showAll && (
              <p style={{ marginBottom: 0, fontStyle: "italic" }}>
                Publisher: {book.publisher}
              </p>
            )}

            {showAll && (
              <p style={{ marginBottom: 10, fontStyle: "italic" }}>
                Pages: {book.page_count}
              </p>
            )}

            <p style={{ margin: 0, fontWeight: 500 }}>
              {getCurrencyString(book.price)}
            </p>
          </Col>
        </Row>

        {showAll && (
          <Row style={{ justifyContent: "center" }}>
            <Col xs={2} />
            <IoIosArrowUp
              style={{ cursor: "pointer" }}
              onClick={() => this.setState({ showAll: false })}
            />
          </Row>
        )}

        {!showAll && (
          <Row style={{ justifyContent: "center" }}>
            <Col xs={2} />
            <IoIosArrowDown
              style={{ cursor: "pointer" }}
              onClick={() => this.setState({ showAll: true })}
            />
          </Row>
        )}
      </Card>
    );
  }
}

export default withConsumer(BookCard);
