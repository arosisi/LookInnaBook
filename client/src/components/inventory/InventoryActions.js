import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { FiMoreVertical } from "react-icons/fi";

import TwoActionDialog from "../TwoActionDialog";

class InventoryActions extends React.Component {
  state = { showDeleteConfirmation: false };

  render() {
    const { item } = this.props;
    const { showDeleteConfirmation } = this.state;

    const MoreIcon = React.forwardRef(({ children, onClick }, ref) => (
      <button
        ref={ref}
        style={{ border: "none", background: "none", outline: "none" }}
        onClick={e => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <FiMoreVertical style={{ marginTop: "-5px" }} />
      </button>
    ));

    return (
      <div>
        <Dropdown drop='right'>
          <Dropdown.Toggle as={MoreIcon} />
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => console.log("Hello")}>
              Edit
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => this.setState({ showDeleteConfirmation: true })}
            >
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <TwoActionDialog
          show={showDeleteConfirmation}
          message='Are you sure you want to delete this item?'
          secondaryAction='Cancel'
          primaryAction='Confirm'
          onHide={() => this.setState({ showDeleteConfirmation: false })}
          onSecondaryAction={() =>
            this.setState({ showDeleteConfirmation: false })
          }
          onPrimaryAction={() => {
            this.setState({ showDeleteConfirmation: false });
            // TODO
          }}
        />
      </div>
    );
  }
}

export default InventoryActions;
