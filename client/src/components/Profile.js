import React from "react";

class Profile extends React.Component {
  render() {
    return (
      <div>
        <h1>Profile</h1>
        <button onClick={() => this.props.history.push("/cart")}>
          Go to Cart
        </button>
      </div>
    );
  }
}

export default Profile;
