import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

class AppToolTip extends React.Component {
  render() {
    const { disabled, placement, text, children } = this.props;
    return disabled ? (
      children
    ) : (
      <OverlayTrigger
        placement={placement}
        overlay={<Tooltip id='tooltip'>{text}</Tooltip>}
      >
        {children}
      </OverlayTrigger>
    );
  }
}

export default AppToolTip;
