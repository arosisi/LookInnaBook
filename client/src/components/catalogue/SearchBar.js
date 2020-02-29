import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class SearchBar extends React.Component {
  render() {
    const { handleSubmit, handleChange, values } = this.props;
    return (
      <Form inline style={{ marginLeft: "auto" }} onSubmit={handleSubmit}>
        <Form.Control
          type='text'
          style={{ width: 300, marginRight: 5 }}
          placeholder='Search by title, author, or isbn...'
          name='keyword'
          value={values.keyword}
          onChange={handleChange}
        />
        <Button variant='outline-info' type='submit'>
          Search
        </Button>
      </Form>
    );
  }
}

export default SearchBar;
