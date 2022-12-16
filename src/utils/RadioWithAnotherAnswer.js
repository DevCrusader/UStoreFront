import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const RadioWithAnotherAnswer = ({
  name,
  data,
  blockClassName = "",
  style = {},
}) => {
  if (!Array.isArray(data)) {
    return (
      <p style={{ color: "red" }}>
        Переданная коллекция не является списком.
      </p>
    );
  }

  if (!data.length) {
    return <></>;
  }

  const [customValue, setCustomValue] = useState("");
  const [customValueRadioChecked, setCustomValueRadioChecked] =
    useState(false);

  useEffect(() => {
    if (customValue) setCustomValueRadioChecked(true);
  }, [customValue]);

  return (
    <ul
      className={`list-with-another ${blockClassName}`}
      style={style}
    >
      {data.map((value, index) => (
        <li key={index}>
          <label htmlFor={`${name}-${index}`}>
            <input
              id={`${name}-${index}`}
              value={value}
              name={name}
              type={"radio"}
              defaultChecked={!index}
              onChange={() => setCustomValueRadioChecked(false)}
            />
            {value}
          </label>
        </li>
      ))}

      <li>
        <label htmlFor={`${name}-custom`}>
          <input
            type="radio"
            id={`${name}-custom`}
            name="address"
            value={customValue}
            checked={customValueRadioChecked}
            onChange={() => setCustomValueRadioChecked(true)}
          />
          Другое:{" "}
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            required={customValueRadioChecked}
          />
        </label>
      </li>
    </ul>
  );
};

RadioWithAnotherAnswer.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  blockClassName: PropTypes.string,
  style: PropTypes.object,
};

export default RadioWithAnotherAnswer;
