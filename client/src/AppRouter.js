import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import Cart from "./components/cart/Cart";
import Catalogue from "./components/catalogue/Catalogue";
import Checkout from "./components/checkout/Checkout";
import Inventory from "./components/inventory/index";
import Login from "./components/Login";
import NavigationBar from "./components/NavigationBar";
import Orders from "./components/orders/Orders";
import Profile from "./components/user/Profile";
import Registration from "./components/user/Registration";
import Reports from "./components/reports/Reports";
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
          <Route path='/checkout' component={Checkout} />
          <Route path='/inventory' component={Inventory} />
          <Route path='/login' component={Login} />
          <Route path='/profile' component={Profile} />
          <Route path='/registration' component={Registration} />
          <Route path='/reports' component={Reports} />
          <Route path='/orders' component={Orders} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default withConsumer(AppRouter);
