import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

class OneActionDialog extends React.Component {
  render() {
    const { show, message, action, onHide, onAction } = this.props;
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Body>
          <Container>
            <p style={{ margin: "20px 0 30px 0" }}>{message}</p>
            <Row style={{ margin: 0, float: "right" }}>
              <Button variant='primary' onClick={onAction}>
                {action}
              </Button>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    );
  }
}

export default OneActionDialog;
