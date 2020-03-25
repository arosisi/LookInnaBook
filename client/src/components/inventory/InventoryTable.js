import React from "react";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import Toast from "react-bootstrap/Toast";

import AppToolTip from "../../AppToolTip";
import InventoryActions from "./InventoryActions";
import { truncateLink, truncateText, getCurrencyString } from "../../helpers";

class InventoryTable extends React.Component {
  state = {
    showCopyToast: false
  };

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
      success,
      showAlert,
      inventory,
      publishers,
      onRemove,
      onEdit,
      onCloseSuccessToast,
      onCloseAlert
    } = this.props;
    const { showCopyToast } = this.state;
    return (
      <div>
        <Table bordered hover responsive striped>
          <thead>
            <tr>
              <th></th>
              <th>ISBN</th>
              <th>Cover</th>
              <th>Title</th>
              <th>Authors</th>
              <th>Description</th>
              <th>Genres</th>
              <th>Year</th>
              <th>Pages</th>
              <th>Cost</th>
              <th>Price</th>
              <th>Publisher</th>
              <th>Percentage</th>
              <th>Quantity</th>
              <th>Threshold</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.isbn}>
                <td>
                  <InventoryActions
                    item={item}
                    publishers={publishers}
                    onRemove={onRemove}
                    onEdit={onEdit}
                  />
                </td>
                <td>{item.isbn}</td>
                <td>
                  <AppToolTip placement='auto' text={item.coverUrl}>
                    <p
                      style={{ cursor: "copy" }}
                      onClick={() => {
                        navigator.clipboard.writeText(item.coverUrl);
                        this.setState({ showCopyToast: true });
                      }}
                    >
                      {truncateLink(item.coverUrl, 20)}
                    </p>
                  </AppToolTip>
                </td>
                <td>{item.title}</td>
                <td>{item.authors.join(", ")}</td>
                <td>
                  <AppToolTip
                    disabled={item.description.length <= 50}
                    placement='auto'
                    text={item.description}
                  >
                    <p
                      style={{ cursor: "copy" }}
                      onClick={() => {
                        navigator.clipboard.writeText(item.description);
                        this.setState({ showCopyToast: true });
                      }}
                    >
                      {truncateText(item.description, 50)}
                    </p>
                  </AppToolTip>
                </td>
                <td>{item.genres.join(", ")}</td>
                <td>{item.year}</td>
                <td>{item.pageCount}</td>
                <td>{getCurrencyString(item.cost)}</td>
                <td>{getCurrencyString(item.price)}</td>
                <td>{item.publisher}</td>
                <td>{`${(item.publisherPercentage * 100).toFixed(0)}%`}</td>
                <td>{item.quantity}</td>
                <td>{item.threshold}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {this.renderToast(
          showCopyToast,
          () => this.setState({ showCopyToast: false }),
          "Copied to clipboard!"
        )}

        {this.renderToast(
          success,
          onCloseSuccessToast,
          "Successfully updated inventory!"
        )}

        {this.renderAlert(
          showAlert,
          onCloseAlert,
          "Unable to update inventory."
        )}
      </div>
    );
  }
}

export default InventoryTable;
