import React from "react";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import Inventory from "./Inventory";
import PublisherTable from "./PublisherTable";
import withConsumer from "../../withConsumer";

class Main extends React.Component {
  render() {
    const { context } = this.props;
    return (
      <Container fluid style={{ marginTop: 20 }}>
        <Tabs defaultActiveKey='inventory' style={{ marginBottom: 15 }}>
          <Tab eventKey='inventory' title='Inventory'>
            <Inventory context={context} />
          </Tab>
          <Tab eventKey='publishers' title='Publishers'>
            <PublisherTable />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default withConsumer(Main);
