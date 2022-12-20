const capitalizeString = (value) => {
  if (typeof value !== "string") {
    throw new TypeError("value must be a string");
  }

  if (value.length) {
    return value[0].toUpperCase() + value.substring(1);
  } else {
    return value;
  }
};

export default capitalizeString;
