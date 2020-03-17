import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import CreditCardInput from "react-credit-card-input";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { Formik } from "formik";

class UserForm extends React.Component {
  state = { showEmailError: false };

  render() {
    const {
      context,
      onSubmit,
      onCloseAlert,
      submitting,
      showAlert
    } = this.props;
    const { showEmailError } = this.state;
    return (
      <Formik
        onSubmit={values => {
          if (
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(values.email)
          ) {
            onSubmit({
              ...values,
              creditCard: values.creditCard.replace(/\s/g, "")
            });
          } else {
            this.setState({ showEmailError: true });
          }
        }}
        initialValues={
          context.user
            ? context.user
            : {
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
              }
        }
      >
        {({ handleSubmit, handleChange, values }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId='firstName'>
              <Form.Label column xs={3}>
                First Name
              </Form.Label>
              <Col xs={9}>
                <Form.Control
                  type='text'
                  name='firstName'
                  value={values.firstName}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId='lastName'>
              <Form.Label column xs={3}>
                Last Name
              </Form.Label>
              <Col xs={9}>
                <Form.Control
                  type='text'
                  name='lastName'
                  value={values.lastName}
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

            <Form.Group as={Row} controlId='password'>
              <Form.Label column xs={3}>
                Password
              </Form.Label>
              <Col xs={9}>
                <Form.Control
                  type='password'
                  name='password'
                  value={values.password}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId='creditCard'>
              <Form.Label column xs={3}>
                Credit Card
              </Form.Label>
              <Col xs={9}>
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

            <Form.Group as={Row} controlId='holderName'>
              <Form.Label column xs={3}>
                Holder Name
              </Form.Label>
              <Col xs={9}>
                <Form.Control
                  type='text'
                  name='holderName'
                  value={values.holderName}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId='billingAddress'>
              <Form.Label column xs={3}>
                Billing Address
              </Form.Label>
              <Col xs={9}>
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
              controlId='buttons'
              style={{ float: "right", alignItems: "center" }}
            >
              {submitting ? (
                <Col>
                  <Spinner animation='border' variant='primary' />
                </Col>
              ) : showAlert ? (
                <Col>
                  <Alert variant='danger' dismissible onClose={onCloseAlert}>
                    Email has already been used.
                  </Alert>
                </Col>
              ) : (
                <>
                  <Button
                    variant='secondary'
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
    );
  }
}

export default UserForm;
