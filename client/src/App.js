import React from "react";

import AppProvider from "./AppProvider";
import AppRouter from "./AppRouter";

class App extends React.Component {
  render() {
    return (
      <AppProvider>
        <AppRouter />
      </AppProvider>
    );
  }
}

export default App;
