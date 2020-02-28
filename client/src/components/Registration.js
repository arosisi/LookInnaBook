import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import CreditCardInput from "react-credit-card-input";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { Formik } from "formik";

import withConsumer from "../withConsumer";

class Registration extends React.Component {
  state = { submitting: false, showAlert: false };

  onSubmit = values => {
    const { context } = this.props;
    this.setState({ submitting: true }, () =>
      fetch("http://localhost:9000/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            this.setState({ submitting: false }, () => context.logIn(values));
          } else {
            this.setState({
              submitting: false,
              showAlert: true
            });
            console.log(response.message);
          }
        })
        .catch(error =>
          console.log("Unable to connect to API registration.", error)
        )
    );
  };

  render() {
    const { context } = this.props;
    const { submitting, showAlert } = this.state;
    return (
      <Container style={{ width: 550 }}>
        <h1 style={{ margin: 30, textAlign: "center" }}>Registration</h1>
        <Formik
          onSubmit={this.onSubmit}
          initialValues={{
            firstName: "",
            lastName: "",
            address: "",
            email: "",
            password: "",
            creditCard: "",
            expiryDate: "",
            cvv: "",
            holderName: "",
            billingAddress: ""
          }}
        >
          {({ handleSubmit, handleChange, values }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group as={Row} controlId='formHorizontalFirstName'>
                <Form.Label column sm={3}>
                  First Name
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type='text'
                    name='firstName'
                    value={values.firstName}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId='formHorizontalLastName'>
                <Form.Label column sm={3}>
                  Last Name
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type='text'
                    name='lastName'
                    value={values.lastName}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId='formHorizontalAddress'>
                <Form.Label column sm={3}>
                  Address
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type='text'
                    name='address'
                    value={values.address}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId='formHorizontalEmail'>
                <Form.Label column sm={3}>
                  Email
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type='email'
                    name='email'
                    value={values.email}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId='formHorizontalPassword'>
                <Form.Label column sm={3}>
                  Password
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type='password'
                    name='password'
                    value={values.password}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId='formHorizontalCreditCard'>
                <Form.Label column sm={3}>
                  Credit Card
                </Form.Label>
                <Col sm={9}>
                  <CreditCardInput
                    containerStyle={{ float: "center" }}
                    cardNumberInputProps={{
                      name: "creditCard",
                      value: values.creditCard,
                      onChange: handleChange
                    }}
                    cardExpiryInputProps={{
                      name: "expiryDate",
                      value: values.expiryDate,
                      onChange: handleChange
                    }}
                    cardCVCInputProps={{
                      name: "cvv",
                      value: values.cvv,
                      onChange: handleChange
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId='formHorizontalHolderName'>
                <Form.Label column sm={3}>
                  Holder Name
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type='text'
                    name='holderName'
                    value={values.holderName}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId='formHorizontalBillingAddress'>
                <Form.Label column sm={3}>
                  Billing Address
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type='text'
                    name='billingAddress'
                    value={values.billingAddress}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group
                as={Row}
                controlId='formButtons'
                style={{ float: "right", alignItems: "center" }}
              >
                {submitting ? (
                  <Col>
                    <Spinner animation='border' variant='primary' />
                  </Col>
                ) : showAlert ? (
                  <Col>
                    <Alert
                      variant='danger'
                      dismissible
                      onClose={() => this.setState({ showAlert: false })}
                    >
                      Email has already been used.
                    </Alert>
                  </Col>
                ) : (
                  <>
                    <Button
                      variant='primary'
                      onClick={() => context.redirect("catalogue")}
                    >
                      Cancel
                    </Button>
                    <Col>
                      <Button
                        variant='primary'
                        type='submit'
                        disabled={
                          !values.firstName ||
                          !values.lastName ||
                          !values.email ||
                          !values.password ||
                          !values.address ||
                          !values.creditCard ||
                          !values.expiryDate ||
                          !values.cvv ||
                          !values.holderName ||
                          !values.billingAddress
                        }
                      >
                        Submit
                      </Button>
                    </Col>
                  </>
                )}
              </Form.Group>
            </Form>
          )}
        </Formik>
      </Container>
    );
  }
}

export default withConsumer(Registration);
