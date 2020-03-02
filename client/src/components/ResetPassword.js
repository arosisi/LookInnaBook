import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { Formik } from "formik";

class ResetPassword extends React.Component {
  state = { submitting: false, success: false, showAlert: false };

  handleSubmit = values => {
    this.setState({ submitting: true }, () =>
      fetch("http://localhost:9000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            this.setState({ submitting: false, success: true });
          } else {
            this.setState({
              submitting: false,
              showAlert: true
            });
            console.log(response.message);
          }
        })
        .catch(error =>
          console.log("Unable to connect to API reset-password.", error)
        )
    );
  };

  render() {
    const { email, onClose, onSuccess } = this.props;
    const { submitting, success, showAlert } = this.state;
    return (
      <Container>
        <h3 style={{ margin: "10px 0 30px 0", textAlign: "center" }}>
          Reset Password
        </h3>

        {success ? (
          <Alert variant='success' dismissible onClose={onSuccess}>
            {`A new password has been sent to your email address.`}
          </Alert>
        ) : (
          <Formik
            onSubmit={this.handleSubmit}
            initialValues={{
              email: email
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
                      value={values.email}
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
                        Invalid email.
                      </Alert>
                    </Col>
                  ) : (
                    <>
                      <Button variant='secondary' onClick={onClose}>
                        Cancel
                      </Button>
                      <Col>
                        <Button
                          variant='primary'
                          type='submit'
                          disabled={!values.email}
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
        )}
      </Container>
    );
  }
}

export default ResetPassword;
