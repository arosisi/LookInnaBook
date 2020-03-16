import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { Formik } from "formik";

class PublisherForm extends React.Component {
  state = { showNumberError: false, showEmailError: false };

  getInitialValues = publisher => ({
    name: publisher.name,
    address: publisher.address,
    numbers: publisher.numbers.join(" | "),
    email: publisher.email,
    bankAccount: publisher.bankAccount
  });

  tranform = values => {
    const { publisher } = this.props;
    const identifier =
      publisher && publisher.name !== values.name
        ? { name: publisher.name, newName: values.name }
        : { name: values.name };
    return {
      ...identifier,
      address: values.address,
      numbers: values.numbers.split("|").map(number => {
        const cleaned = number.replace(/[-\s]/g, "");
        // prettier-ignore
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }),
      email: values.email,
      bankAccount: values.bankAccount
    };
  };

  render() {
    const { show, publisher, onSubmit, onCancel } = this.props;
    const { showNumberError, showEmailError } = this.state;
    return (
      <Modal show={show} size='lg' onHide={() => {}}>
        <Modal.Body>
          <Container>
            <Formik
              onSubmit={values => {
                let hasNumberError = false;
                let hasEmailError = false;
                values.numbers
                  .split("|")
                  .map(number => number.replace(/[-\s]/g, ""))
                  .forEach(number => {
                    if (number.length !== 10) {
                      hasNumberError = true;
                    }
                  });
                if (
                  // prettier-ignore
                  !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(values.email)
                ) {
                  hasEmailError = true;
                }
                if (hasNumberError || hasEmailError) {
                  this.setState({
                    showNumberError: hasNumberError,
                    showEmailError: hasEmailError
                  });
                } else {
                  onSubmit(this.tranform(values));
                }
              }}
              initialValues={
                publisher
                  ? this.getInitialValues(publisher)
                  : {
                      name: "",
                      address: "",
                      numbers: "",
                      email: "",
                      bankAccount: ""
                    }
              }
            >
              {({ handleSubmit, handleChange, values }) => (
                <Form
                  noValidate
                  style={{ margin: "30px 20px" }}
                  onSubmit={handleSubmit}
                >
                  <Form.Group as={Row} controlId='name'>
                    <Form.Label column xs={3}>
                      Name
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        type='text'
                        name='name'
                        value={values.name}
                        onChange={handleChange}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='address'>
                    <Form.Label column xs={3}>
                      Address
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        type='text'
                        name='address'
                        value={values.address}
                        onChange={handleChange}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='numbers'>
                    <Form.Label column xs={3}>
                      Numbers
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        type='text'
                        name='numbers'
                        isInvalid={showNumberError}
                        value={values.numbers}
                        onChange={event => {
                          if (
                            /^[\d-\s|]+$/.test(event.target.value) ||
                            !event.target.value
                          ) {
                            this.setState({ showNumberError: false });
                            handleChange(event);
                          }
                        }}
                      />
                      {showNumberError ? (
                        <p
                          style={{
                            margin: "0 0 0 0.75rem",
                            fontSize: "0.8rem",
                            color: "#dc3545"
                          }}
                        >
                          Invalid number format.
                        </p>
                      ) : (
                        <p
                          style={{
                            margin: "0 0 0 0.75rem",
                            fontSize: "0.8rem"
                          }}
                        >
                          Enter the numbers in the format XXX-XXX-XXXX,
                          separated by a |
                        </p>
                      )}
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='email'>
                    <Form.Label column xs={3}>
                      Email
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        type='email'
                        name='email'
                        isInvalid={showEmailError}
                        value={values.email}
                        onChange={event => {
                          this.setState({ showEmailError: false });
                          handleChange(event);
                        }}
                      />
                      {showEmailError && (
                        <p
                          style={{
                            margin: "0 0 0 0.75rem",
                            fontSize: "0.8rem",
                            color: "#dc3545"
                          }}
                        >
                          Invalid email format.
                        </p>
                      )}
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='bankAccount'>
                    <Form.Label column xs={3}>
                      Bank Account
                    </Form.Label>
                    <Col xs={9}>
                      <Form.Control
                        type='text'
                        name='bankAccount'
                        value={values.bankAccount}
                        onChange={event => {
                          if (
                            /^[\d\s|]+$/.test(event.target.value) ||
                            !event.target.value
                          ) {
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
                            !values.name ||
                            !values.address ||
                            !values.numbers ||
                            !values.email ||
                            !values.bankAccount
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

export default PublisherForm;
