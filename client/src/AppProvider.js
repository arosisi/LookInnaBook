import React from "react";

import AppContext from "./AppContext";

class AppProvider extends React.Component {
  state = {
    page: "catalogue",
    user: null,
    redirect: page => this.setState({ page }),
    logIn: user => this.setState({ page: "catalogue", user }),
    logOut: () => this.setState({ page: "catalogue", user: null })
  };

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
