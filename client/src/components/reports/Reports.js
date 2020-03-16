import React from "react";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import Balance from "./Balance";
import Sales from "./Sales";

class Reports extends React.Component {
  state = { tab: "balance" };

  render() {
    const { tab } = this.state;
    return (
      <Container fluid style={{ marginTop: 20 }}>
        <Tabs
          style={{ marginBottom: 15 }}
          onSelect={key => this.setState({ tab: key })}
        >
          <Tab eventKey='balance' title='Balance'>
            {tab === "balance" && <Balance />}
          </Tab>
          <Tab eventKey='sales-by-author' title='Sales by Author'>
            {tab === "sales-by-author" && <Sales type='author' />}
          </Tab>
          <Tab eventKey='sales-by-genre' title='Sales by Genre'>
            {tab === "sales-by-genre" && <Sales type='genre' />}
          </Tab>
          <Tab eventKey='sales-by-publisher' title='Sales by Publisher'>
            {tab === "sales-by-publisher" && <Sales type='publisher' />}
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default Reports;
