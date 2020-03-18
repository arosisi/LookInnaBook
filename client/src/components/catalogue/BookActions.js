import React from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

import OneActionDialog from "../OneActionDialog";

class BookActions extends React.Component {
  state = { showAddToCartError: false };

  getAlreadyAddedCount = book => {
    const { context } = this.props;
    let count = 0;
    context.cart.forEach(item => {
      if (item.book.isbn === book.isbn) {
        count = item.addedToCart;
      }
    });
    return count;
  };

  render() {
    const { context, book, value, onChange } = this.props;
    const { showAddToCartError } = this.state;
    const alreadyAddedCount = this.getAlreadyAddedCount(book);
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
                : { userSelect: "none" }
            }
            onClick={() => {
              if (value > 0) {
                if (alreadyAddedCount + parseInt(value) <= book.quantity) {
                  context.addToCart(book, parseInt(value));
                  onChange(0);
                } else {
                  this.setState({ showAddToCartError: true });
                }
              }
            }}
          >
            Add to Cart
          </InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          type='number'
          style={{ width: 60 }}
          value={value}
          onChange={event => {
            const value = event.target.value;
            if (value >= 0 && value <= book.quantity) {
              onChange(value);
            }
          }}
        />

        <OneActionDialog
          show={showAddToCartError}
          message='Cannot add more to cart.'
          action='Close'
          onHide={() => this.setState({ showAddToCartError: false })}
          onAction={() => this.setState({ showAddToCartError: false })}
        />
      </InputGroup>
    );
  }
}

export default BookActions;
