import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { Formik } from "formik";

import BookList from "./BookList";
import FilterBox from "./FilterBox";
import SearchBar from "./SearchBar";
import { filter } from "../../helpers";
import { priceChecks, genreChecks, publisherChecks } from "./checks";

class Catalogue extends React.Component {
  state = {
    controller: new AbortController(),
    fetching: false,
    books: [],
    filtered: [],
    activePage: 1
  };

  componentDidMount() {
    const { controller } = this.state;
    this.setState({ fetching: true }, () => {
      fetch("http://localhost:9000/books", {
        signal: controller.signal,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbns: null })
      })
        .then(response => response.json())
        .then(response => {
          this.setState({
            fetching: false,
            books: response.books
              .filter(book => book.available)
              .map(book => ({
                ...book,
                quantity: parseInt(book.quantity)
              })),
            filtered: response.books
              .filter(book => book.available)
              .map(book => ({
                ...book,
                quantity: parseInt(book.quantity)
              }))
          });
        })
        .catch(error => console.log("Unable to connect to API books.", error));
    });
  }

  componentWillUnmount() {
    this.state.controller.abort();
  }

  handleSubmit = values => {
    const { fetching, books } = this.state;
    if (!fetching) {
      this.setState({ filtered: filter(books, values), activePage: 1 });
    }
  };

  extractVars = checks => {
    const vars = {};
    checks.forEach(check => {
      vars[check.name] = false;
    });
    return vars;
  };

  render() {
    const { fetching, filtered, activePage } = this.state;
    return (
      <Formik
        onSubmit={this.handleSubmit}
        initialValues={{
          keyword: "",
          ...this.extractVars(priceChecks),
          ...this.extractVars(genreChecks),
          ...this.extractVars(publisherChecks)
        }}
      >
        {({ handleSubmit, handleChange, values }) => (
          <div style={{ margin: 20 }}>
            <Row style={{ margin: 0 }}>
              {/* Search bar */}
              <SearchBar
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                values={values}
              />
            </Row>

            <Row style={{ marginTop: 20 }}>
              {/* Filter box */}
              <Col xs='3'>
                <FilterBox
                  handleSubmit={handleSubmit}
                  handleChange={handleChange}
                  values={values}
                />
              </Col>

              {/* Book div */}
              <Col xs='9'>
                {fetching ? (
                  <Row style={{ justifyContent: "center" }}>
                    <Spinner animation='border' variant='primary' />
                  </Row>
                ) : (
                  <BookList
                    books={filtered}
                    activePage={activePage}
                    handlePageChange={selected =>
                      this.setState({ activePage: selected })
                    }
                  />
                )}
              </Col>
            </Row>
          </div>
        )}
      </Formik>
    );
  }
}

export default Catalogue;
