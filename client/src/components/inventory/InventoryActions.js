import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { FiMoreVertical } from "react-icons/fi";

import InventoryForm from "./InventoryForm";
import TwoActionDialog from "../TwoActionDialog";

class InventoryActions extends React.Component {
  state = { showEditForm: false, showDeleteConfirmation: false };

  render() {
    const { item, publishers, onRemove, onEdit } = this.props;
    const { showEditForm, showDeleteConfirmation } = this.state;

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
            <Dropdown.Item
              onClick={() => this.setState({ showEditForm: true })}
            >
              Edit
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => this.setState({ showDeleteConfirmation: true })}
            >
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <InventoryForm
          show={showEditForm}
          item={item}
          publishers={publishers}
          onSubmit={onEdit}
          onCancel={() => this.setState({ showEditForm: false })}
        />

        <TwoActionDialog
          show={showDeleteConfirmation}
          message='Are you sure you want to delete this item?'
          secondaryAction='Cancel'
          primaryAction='Confirm'
          onHide={() => this.setState({ showDeleteConfirmation: false })}
          onSecondaryAction={() =>
            this.setState({ showDeleteConfirmation: false })
          }
          onPrimaryAction={() =>
            this.setState({ showDeleteConfirmation: false }, () =>
              onRemove(item.isbn)
            )
          }
        />
      </div>
    );
  }
}

export default InventoryActions;
