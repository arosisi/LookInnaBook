import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import BookList from "./BookList";
import SummaryBox from "./SummaryBox";
import withConsumer from "../../withConsumer";

class Cart extends React.Component {
  state = { empty: false, fetching: false, books: [] };

  componentDidMount() {
    const { context } = this.props;
    const isbns = [];
    context.cart.forEach(item => {
      isbns.push(item.book.isbn);
    });
    if (isbns.length) {
      this.setState({ fetching: true }, () => {
        fetch("http://localhost:9000/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isbns })
        })
          .then(response => response.json())
          .then(response => {
            this.setState({
              fetching: false,
              // TODO: just books: response.books
              // when integrated with back-end
              books: response.books.filter(book => isbns.includes(book.isbn))
            });
          })
          .catch(error =>
            console.log("Unable to connect to API books.", error)
          );
      });
    } else {
      this.setState({ empty: true });
    }
  }

  getBooksAfterRemove = () => {
    const { context } = this.props;
    const { books } = this.state;
    const isbns = [];
    context.cart.forEach(item => {
      isbns.push(item.book.isbn);
    });
    return books.filter(book => isbns.includes(book.isbn));
  };

  render() {
    const { context } = this.props;
    const { empty, fetching } = this.state;
    const booksAfterRemove = this.getBooksAfterRemove();
    return (
      <div style={{ margin: 20 }}>
        <Row style={{ marginTop: 20 }}>
          {/* Summary box */}
          <Col xs='3'>
            {/* <SummaryBox
                  handleSubmit={handleSubmit}
                  handleChange={handleChange}
                  values={values}
                /> */}
          </Col>

          {/* Book div */}
          <Col xs='9'>
            {empty ? (
              <p style={{ textAlign: "center" }}>
                You have not placed any items in cart.
              </p>
            ) : fetching ? (
              <Row style={{ justifyContent: "center" }}>
                <Spinner animation='border' variant='primary' />
              </Row>
            ) : booksAfterRemove.length ? (
              <BookList context={context} books={booksAfterRemove} />
            ) : (
              <p style={{ textAlign: "center" }}>Your cart is now empty.</p>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default withConsumer(Cart);
