import React from "react";

import withConsumer from "../withConsumer";

class Checkout extends React.Component {
  render() {
    const { context } = this.props;
    return (
      <div>
        <h1>Checkout</h1>
        <button onClick={() => this.props.history.push("/cart")}>
          Go to Cart
        </button>
      </div>
    );
  }
}

export default withConsumer(Checkout);
