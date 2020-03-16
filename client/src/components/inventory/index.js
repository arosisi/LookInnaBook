import React from "react";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import Inventory from "./Inventory";
import Publishers from "./Publishers";

class Main extends React.Component {
  state = { tab: "inventory" };

  render() {
    const { tab } = this.state;
    return (
      <Container fluid style={{ marginTop: 20 }}>
        <Tabs
          style={{ marginBottom: 15 }}
          onSelect={key => this.setState({ tab: key })}
        >
          <Tab eventKey='inventory' title='Inventory'>
            {tab === "inventory" && <Inventory />}
          </Tab>
          <Tab eventKey='publishers' title='Publishers'>
            {tab === "publishers" && <Publishers />}
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default Main;
