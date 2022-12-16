import React, { useContext } from "react";
import PropTypes from "prop-types";
import CollectionContext from "../context/CollectionContext";
import { Link } from "react-router-dom";

const NavigationSideBar = ({ collections, userVisibleLine }) => {
  const { collection } = useContext(CollectionContext);

  return (
    <div
      style={{
        top: `${userVisibleLine}px`,
      }}
      className="navigation-bar"
    >
      <header>Коллекции</header>
      <ul>
        {collections.map((item, index) => (
          <li
            key={index}
            className={`${collection === item ? "current" : ""}`}
          >
            <Link to={`#${item}`}>{item}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

NavigationSideBar.propTypes = {
  collections: PropTypes.arrayOf(PropTypes.string).isRequired,
  userVisibleLine: PropTypes.number,
};

export default NavigationSideBar;
