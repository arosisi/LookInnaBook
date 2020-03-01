import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Jumbotron from "react-bootstrap/Jumbotron";

import { priceChecks, genreChecks, publisherChecks } from "./checks";

class FilterBox extends React.Component {
  renderFormChecks = (checks, values, handleChange) =>
    checks.map(check => (
      <Form.Group
        key={check.name}
        as={Row}
        controlId={check.name}
        style={{ margin: 0, userSelect: "none" }}
      >
        <Form.Check
          type='checkbox'
          name={check.name}
          checked={values[check.name]}
          onChange={handleChange}
          label={check.label}
        />
      </Form.Group>
    ));

  render() {
    const { handleSubmit, handleChange, values } = this.props;
    return (
      <Jumbotron style={{ padding: "1.5rem" }}>
        <Form onSubmit={handleSubmit}>
          <Form.Label style={{ userSelect: "none" }}>Price Range</Form.Label>
          {this.renderFormChecks(priceChecks, values, handleChange)}
          <hr />
          <Form.Label style={{ userSelect: "none" }}>Genre</Form.Label>
          {this.renderFormChecks(genreChecks, values, handleChange)}
          <hr />
          <Form.Label style={{ userSelect: "none" }}>Publisher</Form.Label>
          {this.renderFormChecks(publisherChecks, values, handleChange)}

          <Row style={{ justifyContent: "center" }}>
            <Button
              variant='outline-info'
              style={{ marginTop: 20 }}
              type='submit'
            >
              Apply
            </Button>
          </Row>
        </Form>
      </Jumbotron>
    );
  }
}

export default FilterBox;
