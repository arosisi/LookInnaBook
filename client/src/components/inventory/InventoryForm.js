import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { Formik } from "formik";

import { getCurrencyString } from "../../helpers";

class InventoryForm extends React.Component {
  state = { showIsbnError: false, showYearError: false };

  getInitialValues = item => ({
    isbn: item.isbn,
    coverUrl: item.coverUrl,
    title: item.title,
    authors: item.authors.join(" | "),
    description: item.description,
    genres: item.genres.join(" | "),
    year: item.year,
    pageCount: item.pageCount,
    cost: getCurrencyString(item.cost).substring(1),
    price: getCurrencyString(item.price).substring(1),
    publisher: item.publisher,
    publisherPercentage: Math.ceil(item.publisherPercentage * 100),
    quantity: item.quantity,
    threshold: item.threshold
  });

  tranform = values => ({
    isbn: values.isbn,
    coverUrl: values.coverUrl,
    title: values.title,
    authors: values.authors.split("|").map(author => author.trim()),
    description: values.description,
    genres: values.genres.split("|").map(genre => genre.trim()),
    year: values.year,
    pageCount: values.pageCount,
    cost: parseFloat(values.cost),
    price: parseFloat(values.price),
    publisher: values.publisher,
    publisherPercentage: values.publisherPercentage / 100,
    quantity: values.quantity,
    threshold: values.threshold
  });

  render() {
    const {
      show,
      addingItem,
      item,
      publishers,
      onSubmit,
      onCancel
    } = this.props;
    const { showIsbnError, showYearError } = this.state;
    return (
      <Modal show={show} size='lg' onHide={() => {}}>
        <Modal.Body>
          <Container>
            <Formik
              onSubmit={values => {
                let hasIsbnError = false;
                let hasYearError = false;
                if (values.isbn.length !== 13) {
                  hasIsbnError = true;
                }
                if (values.year < 1000) {
                  hasYearError = true;
                }
                if (hasIsbnError || hasYearError) {
                  this.setState({
                    showIsbnError: hasIsbnError,
                    showYearError: hasYearError
                  });
                } else {
                  onSubmit(this.tranform(values));
                }
              }}
              initialValues={
                item
                  ? this.getInitialValues(item)
                  : {
                      isbn: "",
                      coverUrl: "",
                      title: "",
                      authors: "",
                      description: "",
                      genres: "",
                      year: "",
                      pageCount: "",
                      cost: "",
                      price: "",
                      publisher: publishers[0],
                      publisherPercentage: "",
                      quantity: "",
                      threshold: ""
                    }
              }
            >
              {({ handleSubmit, handleChange, values }) => (
                <Form
                  noValidate
                  style={{ margin: "30px 20px" }}
                  onSubmit={handleSubmit}
                >
                  <Form.Group as={Row} controlId='isbn'>
                    <Form.Label column xs={3}>
                      isbn
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        type='text'
                        name='isbn'
                        disabled={!addingItem}
                        isInvalid={showIsbnError}
                        value={values.isbn}
                        onChange={event => {
                          if (
                            (/^\d+$/.test(event.target.value) &&
                              event.target.value.length <= 13) ||
                            !event.target.value
                          ) {
                            this.setState({ showIsbnError: false });
                            handleChange(event);
                          }
                        }}
                      />
                      {showIsbnError && (
                        <p
                          style={{
                            margin: "0 0 0 0.75rem",
                            fontSize: "0.8rem",
                            color: "#dc3545"
                          }}
                        >
                          isbn must contain 13 digits.
                        </p>
                      )}
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='coverUrl'>
                    <Form.Label column xs={3}>
                      Cover URL
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        type='text'
                        name='coverUrl'
                        value={values.coverUrl}
                        onChange={handleChange}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='title'>
                    <Form.Label column xs={3}>
                      Title
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        type='text'
                        name='title'
                        value={values.title}
                        onChange={handleChange}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='authors'>
                    <Form.Label column xs={3}>
                      Authors
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        type='text'
                        name='authors'
                        value={values.authors}
                        onChange={handleChange}
                      />
                      <p
                        style={{ margin: "0 0 0 0.75rem", fontSize: "0.8rem" }}
                      >
                        Enter the authors, separated by a |
                      </p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='description'>
                    <Form.Label column xs={3}>
                      Description
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        as='textarea'
                        rows='5'
                        name='description'
                        value={values.description}
                        onChange={handleChange}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='genres'>
                    <Form.Label column xs={3}>
                      Genres
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        type='text'
                        name='genres'
                        value={values.genres}
                        onChange={handleChange}
                      />
                      <p
                        style={{ margin: "0 0 0 0.75rem", fontSize: "0.8rem" }}
                      >
                        Enter the genres, separated by a |
                      </p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='year'>
                    <Form.Label column xs={3}>
                      Year
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        type='number'
                        name='year'
                        isInvalid={showYearError}
                        value={values.year}
                        onChange={event => {
                          if (
                            (event.target.value > 0 &&
                              event.target.value < 10000) ||
                            !event.target.value
                          ) {
                            this.setState({ showYearError: false });
                            handleChange(event);
                          }
                        }}
                      />
                      {showYearError && (
                        <p
                          style={{
                            margin: "0 0 0 0.75rem",
                            fontSize: "0.8rem",
                            color: "#dc3545"
                          }}
                        >
                          Year must contain 4 digits.
                        </p>
                      )}
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='pageCount'>
                    <Form.Label column xs={3}>
                      Page Count
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        type='number'
                        name='pageCount'
                        value={values.pageCount}
                        onChange={event => {
                          if (event.target.value > 0 || !event.target.value) {
                            handleChange(event);
                          }
                        }}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='cost'>
                    <Form.Label column xs={3}>
                      Cost
                    </Form.Label>
                    <Col xs={9}>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text id='dollar'>$</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          type='text'
                          name='cost'
                          disabled={!addingItem}
                          value={values.cost}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='price'>
                    <Form.Label column xs={3}>
                      Price
                    </Form.Label>
                    <Col xs={9}>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text id='dollar'>$</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          type='text'
                          name='price'
                          value={values.price}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='publisher'>
                    <Form.Label column xs={3}>
                      Publisher
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        as='select'
                        name='publisher'
                        disabled={!addingItem}
                        value={values.publisher}
                        onChange={handleChange}
                      >
                        {publishers.map(publisher => (
                          <option key={publisher}>{publisher}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='publisherPercentage'>
                    <Form.Label column xs={3}>
                      Publisher Percentage
                    </Form.Label>
                    <Col xs={9}>
                      <InputGroup>
                        <Form.Control
                          type='number'
                          name='publisherPercentage'
                          disabled={!addingItem}
                          value={values.publisherPercentage}
                          onChange={event => {
                            if (
                              (event.target.value > 0 &&
                                event.target.value <= 100) ||
                              !event.target.value
                            ) {
                              handleChange(event);
                            }
                          }}
                        />
                        <InputGroup.Append>
                          <InputGroup.Text
                            id='percent'
                            style={{ borderRadius: "0 0.25rem 0.25rem 0" }}
                          >
                            %
                          </InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='quantity'>
                    <Form.Label column xs={3}>
                      Quantity
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        type='number'
                        name='quantity'
                        value={values.quantity}
                        onChange={event => {
                          if (event.target.value >= 0 || !event.target.value) {
                            handleChange(event);
                          }
                        }}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='threshold'>
                    <Form.Label column xs={3}>
                      Threshold
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        type='number'
                        name='threshold'
                        value={values.threshold}
                        onChange={event => {
                          if (event.target.value >= 0 || !event.target.value) {
                            handleChange(event);
                          }
                        }}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    controlId='buttons'
                    style={{
                      marginTop: 10,
                      float: "right",
                      alignItems: "center"
                    }}
                  >
                    <>
                      <Button variant='secondary' onClick={onCancel}>
                        Cancel
                      </Button>
                      <Col>
                        <Button
                          variant='primary'
                          type='submit'
                          disabled={
                            !values.isbn ||
                            !values.coverUrl ||
                            !values.title ||
                            !values.authors ||
                            !values.description ||
                            !values.genres ||
                            !values.year ||
                            !values.pageCount ||
                            !values.cost ||
                            !values.price ||
                            !values.publisher ||
                            !values.publisherPercentage ||
                            !values.quantity ||
                            !values.threshold
                          }
                        >
                          Submit
                        </Button>
                      </Col>
                    </>
                  </Form.Group>
                </Form>
              )}
            </Formik>
          </Container>
        </Modal.Body>
      </Modal>
    );
  }
}

export default InventoryForm;
