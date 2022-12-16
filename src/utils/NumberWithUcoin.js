import React from "react";
import PropTypes from "prop-types";

const NumberWithUcoin = ({
  number,
  changeFontSize = "1",
  additionalClasses = [],
}) => {
  return (
    <span
      className={["number-with-icon", ...additionalClasses].join(" ")}
      style={{ fontSize: `${changeFontSize}em` }}
    >
      <span className="price">{number}</span>
      <span className="icon"></span>
    </span>
  );
};

NumberWithUcoin.propTypes = {
  number: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element,
  ]).isRequired,
  changeFontSize: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  ucoinCollection: PropTypes.string,
  additionalClasses: PropTypes.arrayOf(PropTypes.string),
};

export default NumberWithUcoin;
