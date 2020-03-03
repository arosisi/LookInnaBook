import React from "react";

import AppContext from "./AppContext";

class AppProvider extends React.Component {
  state = {
    page: "catalogue",
    user: null,
    cart: [],
    redirect: page => this.setState({ page }),
    logIn: user => this.setState({ page: "catalogue", user }),
    logOut: () => this.setState({ page: "catalogue", user: null }),
    addToCart: (book, addedToCart) => {
      const { cart } = this.state;
      const alreadyInCart = cart.some(item => item.book.isbn === book.isbn);
      if (alreadyInCart) {
        this.setState({
          cart: cart.map(item => {
            if (item.book.isbn === book.isbn) {
              return { ...item, addedToCart: item.addedToCart + addedToCart };
            }
            return item;
          })
        });
      } else {
        this.setState({ cart: cart.concat({ book, addedToCart }) });
      }
    },
    removeFromCart: book => {
      const { cart } = this.state;
      this.setState({
        cart: cart.filter(item => item.book.isbn !== book.isbn)
      });
    },
    updateCart: (book, addedToCart) => {
      const { cart } = this.state;
      this.setState({
        cart: cart.map(item => {
          if (item.book.isbn === book.isbn) {
            return { ...item, addedToCart };
          }
          return item;
        })
      });
    },
    clearCart: () => this.setState({ cart: [] })
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
