import React from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { MdDelete } from "react-icons/md";

import TwoActionDialog from "../TwoActionDialog";

class BookActions extends React.Component {
  state = { showRemoveConfirmation: false };

  render() {
    const { context, book, value, onChange } = this.props;
    const { showRemoveConfirmation } = this.state;
    return (
      <InputGroup size='sm'>
        <InputGroup.Prepend>
          <InputGroup.Text
            style={
              value > 0
                ? {
                    background: "mediumseagreen",
                    cursor: "pointer",
                    color: "white"
                  }
                : null
            }
            onClick={() => {
              if (value <= book.quantity) {
                context.updateCart(book, parseInt(value));
                this.setState({ [book.isbn]: 0 });
              } else {
                alert("Not enough in stock.");
              }
            }}
          >
            Update Quantity
          </InputGroup.Text>
        </InputGroup.Prepend>

        <FormControl
          type='number'
          style={{ width: 60, borderRadius: "0 4px 4px 0" }}
          value={value}
          onChange={event => {
            const value = event.target.value;
            if (value >= 0 && value <= book.quantity) {
              onChange(value);
            }
          }}
        />

        <InputGroup.Append>
          <InputGroup.Text style={{ background: 0, border: "none" }}>
            <MdDelete
              style={{ fontSize: 20, color: "crimson", cursor: "pointer" }}
              onClick={() => this.setState({ showRemoveConfirmation: true })}
            />
          </InputGroup.Text>
        </InputGroup.Append>

        <TwoActionDialog
          show={showRemoveConfirmation}
          message='Are you sure you want to remove this item?'
          secondaryAction='Cancel'
          primaryAction='Confirm'
          onHide={() => this.setState({ showRemoveConfirmation: false })}
          onSecondaryAction={() =>
            this.setState({ showRemoveConfirmation: false })
          }
          onPrimaryAction={() => {
            this.setState({ showRemoveConfirmation: false });
            context.removeFromCart(book);
          }}
        />
      </InputGroup>
    );
  }
}

export default BookActions;
