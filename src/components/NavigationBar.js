import React from "react";

const NavigationBar = ({ collectionsVisibility }) => {
  return (
    <div>
      <ul>
        {Object.entries(collectionsVisibility).map(
          ([key, value], index) => (
            <li
              key={index}
              style={{ color: value ? "black" : "lightgray" }}
            >
              {key}
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default NavigationBar;
