import React from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

class BookActions extends React.Component {
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
                : null
            }
            onClick={() => {
              if (alreadyAddedCount + parseInt(value) <= book.quantity) {
                context.addToCart(book, parseInt(value));
                this.setState({ [book.isbn]: 0 });
              } else {
                alert("Cannot add more to cart.");
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
      </InputGroup>
    );
  }
}

export default BookActions;
