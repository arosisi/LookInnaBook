import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import InventoryTable from "./InventoryTable";
import withConsumer from "../../withConsumer";

class Inventory extends React.Component {
  state = {
    controller: new AbortController(),
    fetching: false,
    inventory: []
  };

  componentDidMount() {
    const { context } = this.props;
    const { controller } = this.state;
    if (context.user) {
      this.setState({ fetching: true }, () => {
        fetch("http://localhost:9000/inventory", { signal: controller.signal })
          .then(response => response.json())
          .then(response => {
            this.setState({
              fetching: false,
              inventory: response.inventory
            });
          })
          .catch(error =>
            console.log("Unable to connect to API inventory.", error)
          );
      });
    }
  }

  componentWillUnmount() {
    this.state.controller.abort();
  }

  render() {
    const { fetching, inventory } = this.state;
    return (
      <Container fluid style={{ marginTop: 20 }}>
        {fetching ? (
          <Row style={{ justifyContent: "center" }}>
            <Spinner animation='border' variant='primary' />
          </Row>
        ) : (
          <div>
            {inventory.length ? (
              <InventoryTable inventory={inventory} />
            ) : (
              <p style={{ textAlign: "center" }}>
                You do not have any items in your inventory.
              </p>
            )}
          </div>
        )}
      </Container>
    );
  }
}

export default withConsumer(Inventory);
