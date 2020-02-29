import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import Cart from "./components/Cart";
import Catalogue from "./components/catalogue/Catalogue";
import Login from "./components/Login";
import NavigationBar from "./components/NavigationBar";
import Orders from "./components/Orders";
import Profile from "./components/Profile";
import Registration from "./components/Registration";
import withConsumer from "./withConsumer";

class AppRouter extends React.Component {
  render() {
    const { context } = this.props;
    return (
      <BrowserRouter>
        <NavigationBar />
        <Redirect to={`/${context.page}`} />
        <Switch>
          <Route path='/cart' component={Cart} />
          <Route path='/catalogue' component={Catalogue} />
          <Route path='/login' component={Login} />
          <Route path='/registration' component={Registration} />
          <Route path='/profile' component={Profile} />
          <Route path='/orders' component={Orders} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default withConsumer(AppRouter);
