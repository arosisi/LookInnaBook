import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import BookList from "./BookList";
import SummaryBox from "../common/SummaryBox";
import withConsumer from "../../withConsumer";

class Cart extends React.Component {
  state = {
    controller: new AbortController(),
    empty: false,
    fetching: false,
    books: []
  };

  componentDidMount() {
    const { context } = this.props;
    const isbns = [];
    context.cart.forEach(item => {
      isbns.push(item.book.isbn);
    });
    if (isbns.length) {
      const { controller } = this.state;
      this.setState({ fetching: true }, () => {
        fetch("http://localhost:9000/books", {
          signal: controller.signal,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isbns })
        })
          .then(response => response.json())
          .then(response => {
            if (response.success) {
              this.setState(
                {
                  fetching: false,
                  books: response.books
                    .filter(book => book.available)
                    .map(book => ({
                      ...book,
                      quantity: parseInt(book.quantity)
                    }))
                },
                () =>
                  context.removeUnavailableBooksFromCart(
                    response.books.filter(book => !book.available)
                  )
              );
            } else {
              this.setState({ fetching: false });
              console.log(response.errMessage);
            }
          })
          .catch(error =>
            console.log("Unable to connect to API books.", error)
          );
      });
    } else {
      this.setState({ empty: true });
    }
  }

  componentWillUnmount() {
    this.state.controller.abort();
  }

  getCartError = () => {
    const { context } = this.props;
    const { books } = this.state;
    const addedToCart = {};
    context.cart.forEach(item => {
      addedToCart[item.book.isbn] = item.addedToCart;
    });
    let cartError = false;
    books.forEach(book => {
      if (book.quantity < addedToCart[book.isbn]) {
        cartError = true;
      }
    });
    return cartError;
  };

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
    const cartError = this.getCartError();
    const booksAfterRemove = this.getBooksAfterRemove();
    return (
      <div style={{ margin: 20 }}>
        <Row style={{ marginTop: 20, justifyContent: "center" }}>
          {empty ? (
            <p style={{ marginTop: 10 }}>
              You have not placed any items in cart.
            </p>
          ) : !fetching && !booksAfterRemove.length ? (
            <p style={{ marginTop: 10 }}>Your cart is now empty.</p>
          ) : (
            <>
              {/* Summary box */}
              <Col xs='3'>
                <SummaryBox context={context} cartError={cartError} />
              </Col>

              {/* Book div */}
              <Col xs='9'>
                {fetching ? (
                  <Row style={{ justifyContent: "center" }}>
                    <Spinner animation='border' variant='primary' />
                  </Row>
                ) : (
                  <BookList context={context} books={booksAfterRemove} />
                )}
              </Col>
            </>
          )}
        </Row>
      </div>
    );
  }
}

export default withConsumer(Cart);
