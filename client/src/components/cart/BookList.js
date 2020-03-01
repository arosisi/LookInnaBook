import React from "react";

import BookActions from "./BookActions";
import BookCard from "../common/BookCard";

class BookList extends React.Component {
  state = { initializing: true };

  componentDidMount() {
    const { books } = this.props;
    const state = {};
    books.forEach(book => (state[book.isbn] = 0));
    this.setState({ initializing: false, ...state });
  }

  getLabel = count => (count === 1 ? "copy" : "copies");

  render() {
    const { context, books } = this.props;
    const { initializing } = this.state;
    return initializing
      ? null
      : books.map(book => {
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
        });
  }
}

export default BookList;
