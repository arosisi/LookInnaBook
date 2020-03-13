import React from "react";
import Table from "react-bootstrap/Table";
import Toast from "react-bootstrap/Toast";

import AppToolTip from "../../AppToolTip";
import InventoryActions from "./InventoryActions";
import { truncateLink, truncateText, getCurrencyString } from "../../helpers";

class InventoryTable extends React.Component {
  state = { showToast: false };

  render() {
    const { inventory } = this.props;
    const { showToast } = this.state;
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
                  <InventoryActions item={item} />
                </td>
                <td>{item.isbn}</td>
                <td>
                  <AppToolTip placement='auto' text={item.cover_url}>
                    <p
                      style={{ cursor: "copy" }}
                      onClick={() => {
                        navigator.clipboard.writeText(item.cover_url);
                        this.setState({ showToast: true });
                      }}
                    >
                      {truncateLink(item.cover_url, 20)}
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
                        this.setState({ showToast: true });
                      }}
                    >
                      {truncateText(item.description, 50)}
                    </p>
                  </AppToolTip>
                </td>
                <td>{item.genres.join(", ")}</td>
                <td>{item.year}</td>
                <td>{item.page_count}</td>
                <td>{getCurrencyString(item.cost)}</td>
                <td>{getCurrencyString(item.price)}</td>
                <td>{item.publisher}</td>
                <td>{`${Math.ceil(item.publisher_percentage * 100)}%`}</td>
                <td>{item.quantity}</td>
                <td>{item.threshold}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div style={{ position: "fixed", bottom: 10, left: 10 }}>
          <Toast
            style={{
              color: "#155724",
              background: "#d4edda",
              borderColor: "#c3e6cb"
            }}
            show={showToast}
            delay={3000}
            animation
            autohide
            onClose={() => this.setState({ showToast: false })}
          >
            <Toast.Body>Copied to clipboard!</Toast.Body>
          </Toast>
        </div>
      </div>
    );
  }
}

export default InventoryTable;
