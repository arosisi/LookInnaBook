import React from "react";
import Row from "react-bootstrap/Row";

import AppPagination from "../../AppPagination";
import BookCard from "../common/BookCard";
import BookActions from "./BookActions";
import withConsumer from "../../withConsumer";

const booksPerPage = 10;

class BookList extends React.Component {
  state = { initializing: true };

  componentDidMount() {
    const { books } = this.props;
    const state = { initializing: false };
    books.forEach(book => {
      state[book.isbn] = 0;
    });
    this.setState(state);
  }

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
          return (
            <BookCard key={book.isbn} context={context} book={book}>
              <BookActions
                context={context}
                book={book}
                value={value}
                onChange={value => this.setState({ [book.isbn]: value })}
              />
            </BookCard>
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
