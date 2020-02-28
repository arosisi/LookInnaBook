import React from "react";

class Catalogue extends React.Component {
  render() {
    return (
      <div>
        <h1>Catalogue</h1>
        <button onClick={() => this.props.history.push("/cart")}>
          Go to Cart
        </button>
      </div>
    );
  }
}

export default Catalogue;
