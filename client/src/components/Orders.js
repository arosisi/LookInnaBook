import React from "react";

class Orders extends React.Component {
  render() {
    return (
      <div>
        <h1>Orders</h1>
        <button onClick={() => this.props.history.push("/cart")}>
          Go to Cart
        </button>
      </div>
    );
  }
}

export default Orders;
