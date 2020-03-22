import React from "react";
import Container from "react-bootstrap/Container";

import UserForm from "./UserForm";
import withConsumer from "../../withConsumer";

class Profile extends React.Component {
  state = { submitting: false, showAlert: false };

  cleanValues = values => {
    const { context } = this.props;
    if (context.user.creditCard.replace(/\s/g, "") === values.creditCard) {
      const {
        creditCard,
        // expiryDate,
        // cvv,
        // holderName,
        // billingAddress,
        ...other
      } = values;
      return { ...other };
    }
    return values;
  };

  handleSubmit = values => {
    const { context } = this.props;
    this.setState({ submitting: true }, () =>
      fetch("http://localhost:9000/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.cleanValues(values))
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
            console.log(response.errMessage);
          }
        })
        .catch(error => console.log("Unable to connect to API profile.", error))
    );
  };

  render() {
    const { context } = this.props;
    const { submitting, showAlert } = this.state;
    return (
      <Container style={{ width: 550 }}>
        <h1 style={{ margin: 30, textAlign: "center" }}>Profile</h1>
        <UserForm
          context={context}
          onSubmit={this.handleSubmit}
          onCloseAlert={() => this.setState({ showAlert: false })}
          submitting={submitting}
          showAlert={showAlert}
        />
      </Container>
    );
  }
}

export default withConsumer(Profile);
