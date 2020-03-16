import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import PublisherForm from "./PublisherForm";
import PublisherTable from "./PublisherTable";

class Publishers extends React.Component {
  state = {
    controller: new AbortController(),
    fetching: false,
    showAddForm: false,
    processing: false,
    success: false,
    showAlert: false,
    publishers: []
  };

  componentDidMount() {
    const { controller } = this.state;
    this.setState({ fetching: true }, () => {
      fetch("http://localhost:9000/publishers", { signal: controller.signal })
        .then(response => response.json())
        .then(response => {
          this.setState({
            fetching: false,
            publishers: this.transform(
              response.publishers.filter(publisher => publisher.available)
            )
          });
        })
        .catch(error =>
          console.log("Unable to connect to API publishers.", error)
        );
    });
  }

  componentWillUnmount() {
    this.state.controller.abort();
  }

  handleAdd = values => {
    this.setState({ processing: true }, () => {
      fetch("http://localhost:9000/modify-publisher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", ...values })
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            this.setState({
              processing: false,
              success: true,
              publishers: [values, ...this.state.publishers]
            });
          } else {
            this.setState({
              processing: false,
              showAlert: true
            });
            console.log(response.message);
          }
        })
        .catch(error =>
          console.log("Unable to connect to API modify-publisher.", error)
        );
    });
  };

  handleRemove = name =>
    this.setState({ processing: true }, () => {
      fetch("http://localhost:9000/modify-publisher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", name })
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            this.setState({
              processing: false,
              success: true,
              publishers: this.state.publishers.filter(
                publisher => publisher.name !== name
              )
            });
          } else {
            this.setState({
              processing: false,
              showAlert: true
            });
            console.log(response.message);
          }
        })
        .catch(error =>
          console.log("Unable to connect to API modify-publisher.", error)
        );
    });

  handleEdit = values => {
    this.setState({ processing: true }, () => {
      fetch("http://localhost:9000/modify-publisher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit", ...values })
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            this.setState({
              processing: false,
              success: true,
              publishers: this.state.publishers.map(publisher => {
                if (publisher.name === values.name) {
                  if (values.newName) {
                    const { name, newName, ...other } = values;
                    return { name: newName, ...other };
                  }
                  return values;
                }
                return publisher;
              })
            });
          } else {
            this.setState({
              processing: false,
              showAlert: true
            });
            console.log(response.message);
          }
        })
        .catch(error =>
          console.log("Unable to connect to API modify-publisher.", error)
        );
    });
  };

  transform = publishers =>
    publishers.map(publisher => ({
      name: publisher.name,
      address: publisher.address,
      numbers: publisher.numbers,
      email: publisher.email,
      bankAccount: publisher.bank_account
    }));

  render() {
    const {
      fetching,
      showAddForm,
      processing,
      success,
      showAlert,
      publishers
    } = this.state;
    return fetching ? (
      <Row style={{ justifyContent: "center" }}>
        <Spinner animation='border' variant='primary' />
      </Row>
    ) : (
      <div>
        <Row
          style={{
            margin: "0px 0px 15px 0px",
            justifyContent: "flex-end"
          }}
        >
          <Button onClick={() => this.setState({ showAddForm: true })}>
            Add Publisher
          </Button>
        </Row>

        {publishers.length ? (
          <PublisherTable
            success={success}
            showAlert={showAlert}
            onRemove={this.handleRemove}
            onEdit={this.handleEdit}
            publishers={publishers}
            onCloseSuccessToast={() => this.setState({ success: false })}
            onCloseAlert={() => this.setState({ showAlert: false })}
          />
        ) : (
          <p style={{ textAlign: "center" }}>
            You have not added any publisher.
          </p>
        )}

        <PublisherForm
          show={showAddForm}
          publishers={publishers}
          onSubmit={values => {
            this.setState({ showAddForm: false }, () => this.handleAdd(values));
          }}
          onCancel={() => this.setState({ showAddForm: false })}
        />

        <Modal show={processing} onHide={() => {}}>
          <Modal.Body>Processing...</Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default Publishers;
