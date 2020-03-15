import React from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import InventoryTable from "./InventoryTable";

class Inventory extends React.Component {
  state = {
    controller: new AbortController(),
    fetching: false,
    processing: false,
    success: false,
    showAlert: false,
    inventory: [],
    publishers: []
  };

  componentDidMount() {
    const { context } = this.props;
    const { controller } = this.state;
    if (context.user) {
      this.setState({ fetching: true }, () => {
        fetch("http://localhost:9000/inventory", { signal: controller.signal })
          .then(response => response.json())
          .then(response => {
            this.setState({
              fetching: false,
              inventory: response.inventory,
              publishers: response.publishers
            });
          })
          .catch(error =>
            console.log("Unable to connect to API inventory.", error)
          );
      });
    }
  }

  componentWillUnmount() {
    this.state.controller.abort();
  }

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

  handleEdit = values => console.log(values);
  // this.setState({ processing: true }, () => {
  //   fetch("http://localhost:9000/modify-inventory", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ action: "edit", ...values })
  //   })
  //     .then(response => response.json())
  //     .then(response => {
  //       if (response.success) {
  //         this.setState({
  //           processing: false,
  //           success: true,
  //           inventory: this.state.inventory.map(item =>
  //             item.isbn === values.isbn ? values : item
  //           )
  //         });
  //       } else {
  //         this.setState({
  //           processing: false,
  //           showAlert: true
  //         });
  //         console.log(response.message);
  //       }
  //     })
  //     .catch(error =>
  //       console.log("Unable to connect to API modify-inventory.", error)
  //     );
  // });

  render() {
    const {
      fetching,
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
          <Button>Add Item</Button>
        </Row>
        {inventory.length ? (
          <InventoryTable
            processing={processing}
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
      </div>
    );
  }
}

export default Inventory;
