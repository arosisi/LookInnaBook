import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { Formik } from "formik";

import ForgotPassword from "./ForgotPassword";
import withConsumer from "../withConsumer";
import { formatCreditCard } from "../helpers";

class Login extends React.Component {
  state = {
    showEmailError: false,
    submitting: false,
    showAlert: false,
    showForgotPassword: false
  };

  handleSubmit = values => {
    const { context } = this.props;
    this.setState({ submitting: true }, () =>
      fetch("http://localhost:9000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            this.setState({ submitting: false }, () => {
              context.logIn(this.transform(response.user));
            });
          } else {
            this.setState({
              submitting: false,
              showAlert: true
            });
            console.log(response.errMessage);
          }
        })
        .catch(error => console.log("Unable to connect to API login.", error))
    );
  };

  transform = user => ({
    id: user.u_id,
    role: user.role,
    firstName: user.first_name,
    lastName: user.last_name,
    address: user.address,
    email: user.email,
    password: user.password,
    creditCard: formatCreditCard(user.card_number),
    expiryDate: user.expiry_date,
    cvv: user.cvv,
    holderName: user.holder_name,
    billingAddress: user.billing_address
  });

  render() {
    const { context } = this.props;
    const {
      showEmailError,
      submitting,
      showAlert,
      showForgotPassword
    } = this.state;
    return (
      <Container style={{ width: 500 }}>
        <h1 style={{ margin: 30, textAlign: "center" }}>Login</h1>

        <Formik
          onSubmit={values => {
            if (
              /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(values.email)
            ) {
              this.handleSubmit(values);
            } else {
              this.setState({ showEmailError: true });
            }
          }}
          initialValues={{
            email: "",
            password: ""
          }}
        >
          {({ handleSubmit, handleChange, values }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group as={Row} controlId='email'>
                <Form.Label column xs={2}>
                  Email
                </Form.Label>
                <Col xs={10}>
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
                <Form.Label column xs={2}>
                  Password
                </Form.Label>
                <Col xs={10}>
                  <Form.Control
                    type='password'
                    name='password'
                    value={values.password}
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
                    <Alert
                      variant='danger'
                      dismissible
                      onClose={() => this.setState({ showAlert: false })}
                    >
                      Invalid email or password.
                    </Alert>
                  </Col>
                ) : (
                  <>
                    <Button
                      variant='link'
                      style={{ marginRight: 10 }}
                      disabled={!values.email}
                      onClick={() =>
                        this.setState({ showForgotPassword: true })
                      }
                    >
                      Forgot your password?
                    </Button>
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
                        disabled={!values.email || !values.password}
                      >
                        Submit
                      </Button>
                    </Col>
                  </>
                )}
              </Form.Group>

              <Modal
                show={showForgotPassword}
                onHide={() => this.setState({ showForgotPassword: false })}
              >
                <Modal.Body>
                  <ForgotPassword
                    email={values.email}
                    onClose={() => this.setState({ showForgotPassword: false })}
                    onSuccess={() =>
                      this.setState({ showForgotPassword: false })
                    }
                  />
                </Modal.Body>
              </Modal>
            </Form>
          )}
        </Formik>
      </Container>
    );
  }
}

export default withConsumer(Login);
