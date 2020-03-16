import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import InventoryForm from "./InventoryForm";
import InventoryTable from "./InventoryTable";

class Inventory extends React.Component {
  state = {
    controller: new AbortController(),
    fetching: false,
    showAddForm: false,
    processing: false,
    success: false,
    showAlert: false,
    inventory: [],
    publishers: []
  };

  componentDidMount() {
    const { controller } = this.state;
    this.setState({ fetching: true }, () => {
      fetch("http://localhost:9000/inventory", { signal: controller.signal })
        .then(response => response.json())
        .then(response => {
          this.setState({
            fetching: false,
            inventory: this.transform(
              response.inventory.filter(item => item.available)
            ),
            publishers: response.publishers
          });
        })
        .catch(error =>
          console.log("Unable to connect to API inventory.", error)
        );
    });
  }

  componentWillUnmount() {
    this.state.controller.abort();
  }

  handleAdd = values => {
    this.setState({ processing: true }, () => {
      fetch("http://localhost:9000/modify-inventory", {
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
              inventory: [values, ...this.state.inventory]
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
          console.log("Unable to connect to API modify-inventory.", error)
        );
    });
  };

  handleRemove = isbn =>
    this.setState({ processing: true }, () => {
      fetch("http://localhost:9000/modify-inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", isbn })
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            this.setState({
              processing: false,
              success: true,
              inventory: this.state.inventory.filter(item => item.isbn !== isbn)
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
          console.log("Unable to connect to API modify-inventory.", error)
        );
    });

  handleEdit = values => {
    this.setState({ processing: true }, () => {
      fetch("http://localhost:9000/modify-inventory", {
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
              inventory: this.state.inventory.map(item =>
                item.isbn === values.isbn ? values : item
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
          console.log("Unable to connect to API modify-inventory.", error)
        );
    });
  };

  transform = inventory =>
    inventory.map(item => ({
      isbn: item.isbn,
      coverUrl: item.cover_url,
      title: item.title,
      authors: item.authors,
      description: item.description,
      genres: item.genres,
      year: item.year,
      pageCount: item.page_count,
      cost: item.cost,
      price: item.price,
      publisher: item.publisher,
      publisherPercentage: item.publisher_percentage,
      quantity: item.quantity,
      threshold: item.threshold
    }));

  render() {
    const {
      fetching,
      showAddForm,
      processing,
      success,
      showAlert,
      inventory,
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
            Add Item
          </Button>
        </Row>

        {inventory.length ? (
          <InventoryTable
            success={success}
            showAlert={showAlert}
            onRemove={this.handleRemove}
            onEdit={this.handleEdit}
            inventory={inventory}
            publishers={publishers}
            onCloseSuccessToast={() => this.setState({ success: false })}
            onCloseAlert={() => this.setState({ showAlert: false })}
          />
        ) : (
          <p style={{ textAlign: "center" }}>
            You do not have any items in your inventory.
          </p>
        )}

        <InventoryForm
          show={showAddForm}
          allowIsbnEdit={true}
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

export default Inventory;
