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

import ResetPassword from "./ResetPassword";
import { transform } from "../helpers";
import withConsumer from "../withConsumer";

class Login extends React.Component {
  state = { submitting: false, showAlert: false, showResetPassword: false };

  onSubmit = values => {
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
            this.setState({ submitting: false }, () =>
              context.logIn(transform(response.user))
            );
          } else {
            this.setState({
              submitting: false,
              showAlert: true
            });
            console.log(response.message);
          }
        })
        .catch(error => console.log("Unable to connect to API login.", error))
    );
  };

  render() {
    const { context } = this.props;
    const { submitting, showAlert, showResetPassword } = this.state;
    return (
      <Container style={{ width: 500 }}>
        <h1 style={{ margin: 30, textAlign: "center" }}>Login</h1>

        <Formik
          onSubmit={this.onSubmit}
          initialValues={{
            email: "",
            password: ""
          }}
        >
          {({ handleSubmit, handleChange, values }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group as={Row} controlId='formHorizontalEmail'>
                <Form.Label column sm={2}>
                  Email
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type='email'
                    name='email'
                    value={values.email}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId='formHorizontalPassword'>
                <Form.Label column sm={2}>
                  Password
                </Form.Label>
                <Col sm={10}>
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
                      Invalid email or password.
                    </Alert>
                  </Col>
                ) : (
                  <>
                    <Button
                      variant='link'
                      style={{ marginRight: 10 }}
                      disabled={!values.email}
                      onClick={() => this.setState({ showResetPassword: true })}
                    >
                      Forgot your password?
                    </Button>
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
                        disabled={!values.email || !values.password}
                      >
                        Submit
                      </Button>
                    </Col>
                  </>
                )}
              </Form.Group>

              <Modal
                show={showResetPassword}
                onHide={() => this.setState({ showResetPassword: false })}
              >
                <Modal.Body>
                  <ResetPassword
                    email={values.email}
                    onClose={() => this.setState({ showResetPassword: false })}
                    onSuccess={() =>
                      this.setState({ showResetPassword: false })
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
