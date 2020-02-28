import React from "react";

class Cart extends React.Component {
  render() {
    return (
      <div>
        <h1>Cart</h1>
        <button onClick={() => this.props.history.push("/catalogue")}>
          Go to Catalogue
        </button>
      </div>
    );
  }
}

export default Cart;
