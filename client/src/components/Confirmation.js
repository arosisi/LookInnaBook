import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

class Confirmation extends React.Component {
  render() {
    const { show, message, onHide, onClose, onConfirm } = this.props;
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Body>
          <Container>
            <p style={{ margin: "20px 0 30px 0" }}>{message}</p>
            <Row style={{ margin: 0, float: "right" }}>
              <Button variant='secondary' onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant='primary'
                style={{ marginLeft: 10 }}
                onClick={onConfirm}
              >
                Confirm
              </Button>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    );
  }
}

export default Confirmation;
