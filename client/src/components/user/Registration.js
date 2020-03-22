import React from "react";
import Container from "react-bootstrap/Container";

import UserForm from "./UserForm";
import withConsumer from "../../withConsumer";

class Registration extends React.Component {
  state = { submitting: false, showAlert: false, alertMessage: "" };

  cleanValues = values => ({
    ...values,
    creditCard: values.creditCard.replace(/\s/g, "")
  });

  handleSubmit = values => {
    const { context } = this.props;
    this.setState({ submitting: true }, () =>
      fetch("http://localhost:9000/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.cleanValues(values))
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            this.setState({ submitting: false }, () =>
              context.logIn({ id: response.user.u_id, ...values })
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
          console.log("Unable to connect to API registration.", error)
        )
    );
  };

  render() {
    const { context } = this.props;
    const { submitting, showAlert, alertMessage } = this.state;
    return (
      <Container style={{ width: 550 }}>
        <h1 style={{ margin: 30, textAlign: "center" }}>Registration</h1>
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

export default withConsumer(Registration);
