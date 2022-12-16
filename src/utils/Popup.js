import React from "react";
import PropTypes from "prop-types";

import "../static/css/popupStyle.css";
import { CONTAINER_MAX_SIZE } from "../Consts";

const Popup = ({
  closePopup,
  popupClassName = "",
  header = "Попап",
  body = <></>,
  containerMaxSize = CONTAINER_MAX_SIZE.DEFAULT,
}) => {
  return (
    <div className="popup-wrapper">
      <div
        className={`popup-container container ${containerMaxSize} ${popupClassName}`}
      >
        <span className="close-icon" onClick={closePopup}></span>
        <div className="popup-header">{header}</div>
        <div className="popup-body">{body}</div>
      </div>
    </div>
  );
};

Popup.propTypes = {
  closePopup: PropTypes.func.isRequired,
  popupClassName: PropTypes.string,
  header: PropTypes.string,
  body: PropTypes.element,
  containerMaxSize: PropTypes.string,
};

export default Popup;
