import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

import AppPagination from "../../AppPagination";
import withConsumer from "../../withConsumer";

const booksPerPage = 10;

class BookList extends React.Component {
  state = { initializing: true };

  componentDidMount() {
    const { books } = this.props;
    const state = {};
    books.forEach(book => (state[book.isbn] = 0));
    this.setState({ initializing: false, ...state });
  }

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

  getActivePageBooks = () => {
    const { books, activePage } = this.props;
    const startIndex = (activePage - 1) * booksPerPage;
    const endIndex =
      activePage * booksPerPage > books.length
        ? books.length
        : activePage * booksPerPage;
    return books.slice(startIndex, endIndex);
  };

  render() {
    const { context, books, activePage, handlePageChange } = this.props;
    const { initializing } = this.state;
    const pageCount = Math.ceil(books.length / booksPerPage);
    return initializing ? null : (
      <>
        {this.getActivePageBooks().map(book => {
          const { [book.isbn]: value } = this.state;
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
                    <Row style={{ margin: 0 }}>
                      <InputGroup size='sm'>
                        <InputGroup.Prepend>
                          <InputGroup.Text
                            style={
                              value > 0
                                ? {
                                    background: "mediumseagreen",
                                    cursor: "pointer",
                                    color: "white"
                                  }
                                : null
                            }
                            onClick={() => {
                              if (
                                alreadyAddedCount + parseInt(value) <=
                                book.quantity
                              ) {
                                context.addToCart(book, parseInt(value));
                                this.setState({ [book.isbn]: 0 });
                              } else {
                                alert("Cannot add more to cart.");
                              }
                            }}
                          >
                            Add to Cart
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                          type='number'
                          style={{ width: 60 }}
                          value={value}
                          onChange={event => {
                            const value = event.target.value;
                            if (value >= 0 && value <= book.quantity) {
                              this.setState({
                                [book.isbn]: event.target.value
                              });
                            }
                          }}
                        />
                      </InputGroup>
                    </Row>
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
                      style={{ marginBottom: 8, fontSize: 11, fontWeight: 500 }}
                    >
                      {book.quantity < 10 &&
                        `Only ${book.quantity} ${this.getLabel(
                          book.quantity
                        )} left. `}
                      {`${alreadyAddedCount} ${this.getLabel(
                        alreadyAddedCount
                      )} added to cart.`}
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
        })}

        <Row style={{ marginTop: 20, justifyContent: "center" }}>
          <AppPagination
            pageCount={pageCount}
            activePage={activePage}
            onPageChange={handlePageChange}
          />
        </Row>
      </>
    );
  }
}

export default withConsumer(BookList);
