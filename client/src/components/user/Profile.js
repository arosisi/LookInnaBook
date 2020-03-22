import React from "react";
import Container from "react-bootstrap/Container";

import UserForm from "./UserForm";
import withConsumer from "../../withConsumer";

class Profile extends React.Component {
  state = { submitting: false, showAlert: false, alertMessage: "" };

  cleanValuesForSubmission = values => {
    const { context } = this.props;
    if (context.user.creditCard === values.creditCard) {
      const { creditCard, ...other } = values;
      return { ...other };
    }
    return { ...values, creditCard: values.creditCard.replace(/\s/g, "") };
  };

  cleanValuesForLogin = values => {
    const { context } = this.props;
    if (context.user.creditCard === values.creditCard) {
      const { expiryDate, cvv, holderName, billingAddress } = context.user;
      return { ...values, expiryDate, cvv, holderName, billingAddress };
    }
    return values;
  };

  handleSubmit = values => {
    const { context } = this.props;
    this.setState({ submitting: true }, () => {
      if (
        context.user.creditCard === values.creditCard &&
        (context.user.expiryDate === values.expiryDate ||
          context.user.cvv === values.cvv ||
          context.user.holderName === values.holderName ||
          context.user.billingAddress === values.billingAddress)
      ) {
        this.setState({
          submitting: false,
          showAlert: true,
          alertMessage: "Invalid credit card."
        });
      } else {
        fetch("http://localhost:9000/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.cleanValuesForSubmission(values))
        })
          .then(response => response.json())
          .then(response => {
            if (response.success) {
              this.setState({ submitting: false }, () =>
                context.logIn(this.cleanValuesForLogin(values))
              );
            } else {
              this.setState({
                submitting: false,
                showAlert: true,
                alertMessage:
                  response.errCode === 1
                    ? "Email has already been used."
                    : "Invalid credit card."
              });
              console.log(response.errMessage);
            }
          })
          .catch(error =>
            console.log("Unable to connect to API profile.", error)
          );
      }
    });
  };

  render() {
    const { context } = this.props;
    const { submitting, showAlert, alertMessage } = this.state;
    return (
      <Container style={{ width: 550 }}>
        <h1 style={{ margin: 30, textAlign: "center" }}>Profile</h1>
        <UserForm
          context={context}
          onSubmit={this.handleSubmit}
          onCloseAlert={() => this.setState({ showAlert: false })}
          submitting={submitting}
          showAlert={showAlert}
          alertMessage={alertMessage}
        />
      </Container>
    );
  }
}

export default withConsumer(Profile);
