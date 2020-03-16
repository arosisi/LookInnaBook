import React from "react";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Toast from "react-bootstrap/Toast";

import PublisherActions from "./PublisherActions";

class PublisherTable extends React.Component {
  renderToast = (show, onClose, message) => (
    <div style={{ position: "fixed", bottom: 10, left: 10 }}>
      <Toast
        style={{
          color: "#155724",
          background: "#d4edda",
          borderColor: "#c3e6cb"
        }}
        show={show}
        delay={3000}
        animation
        autohide
        onClose={onClose}
      >
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </div>
  );

  renderAlert = (show, onClose, message) => (
    <div style={{ position: "fixed", bottom: 10, left: 10 }}>
      <Alert
        show={show}
        variant='danger'
        style={{ marginBottom: 0 }}
        dismissible
        onClose={onClose}
      >
        {message}
      </Alert>
    </div>
  );

  render() {
    const {
      processing,
      success,
      showAlert,
      publishers,
      onRemove,
      onEdit,
      onCloseSuccessToast,
      onCloseAlert
    } = this.props;
    return (
      <div>
        <Table bordered hover responsive striped>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Address</th>
              <th>Numbers</th>
              <th>Email</th>
              <th>Bank Account</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map(publisher => (
              <tr key={publisher.name}>
                <td>
                  <PublisherActions
                    publisher={publisher}
                    onRemove={onRemove}
                    onEdit={onEdit}
                  />
                </td>
                <td>{publisher.name}</td>
                <td>{publisher.address}</td>
                <td>
                  {publisher.numbers.map(number => (
                    <div key={number}>{number}</div>
                  ))}
                </td>
                <td>{publisher.email}</td>
                <td>{publisher.bankAccount}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={processing} onHide={() => {}}>
          <Modal.Body>Processing...</Modal.Body>
        </Modal>

        {this.renderToast(
          success,
          onCloseSuccessToast,
          "Successfully updated publishers!"
        )}

        {this.renderAlert(
          showAlert,
          onCloseAlert,
          "Unable to update publishers."
        )}
      </div>
    );
  }
}

export default PublisherTable;
