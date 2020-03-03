import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import CreditCardInput from "react-credit-card-input";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { Formik } from "formik";

class PaymentForm extends React.Component {
  getUserPaymentInfo = user => {
    const {
      firstName,
      lastName,
      address,
      creditCard,
      expiryDate,
      cvv,
      holderName,
      billingAddress
    } = user;
    return {
      recipient: `${firstName} ${lastName}`,
      shippingAddress: address,
      creditCard,
      expiryDate,
      cvv,
      holderName,
      billingAddress
    };
  };

  render() {
    const {
      context,
      onSubmit,
      onCloseAlert,
      submitting,
      showAlert
    } = this.props;
    return (
      <Formik
        onSubmit={onSubmit}
        initialValues={
          context.user
            ? this.getUserPaymentInfo(context.user)
            : {
                recipient: "",
                shippingAddress: "",
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
            <Form.Group as={Row} controlId='recipient'>
              <Form.Label column xs={4}>
                Recipient
              </Form.Label>
              <Col xs={8}>
                <Form.Control
                  type='text'
                  name='recipient'
                  value={values.recipient}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId='shippingAddress'>
              <Form.Label column xs={4}>
                Shipping Address
              </Form.Label>
              <Col xs={8}>
                <Form.Control
                  type='text'
                  name='shippingAddress'
                  value={values.shippingAddress}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId='creditCard'>
              <Form.Label column xs={4}>
                Credit Card
              </Form.Label>
              <Col xs={8}>
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
              <Form.Label column xs={4}>
                Holder Name
              </Form.Label>
              <Col xs={8}>
                <Form.Control
                  type='text'
                  name='holderName'
                  value={values.holderName}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId='billingAddress'>
              <Form.Label column xs={4}>
                Billing Address
              </Form.Label>
              <Col xs={8}>
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
                    Unable to process payment.
                  </Alert>
                </Col>
              ) : (
                <>
                  <Button
                    variant='secondary'
                    onClick={() => context.redirect("cart")}
                  >
                    Cancel
                  </Button>
                  <Col>
                    <Button
                      variant='primary'
                      type='submit'
                      disabled={
                        !values.recipient ||
                        !values.shippingAddress ||
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

export default PaymentForm;
