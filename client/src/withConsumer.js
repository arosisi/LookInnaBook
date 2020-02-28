import React from "react";

import AppContext from "./AppContext";

function withConsumer(Component) {
  return function(props) {
    return (
      <AppContext.Consumer>
        {context => <Component {...props} context={context} />}
      </AppContext.Consumer>
    );
  };
}

export default withConsumer;
