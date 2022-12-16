import React from "react";
import PropTypes from "prop-types";

const List = ({
  data = [],
  listClassName = "",
  styles = {},

  renderItem,
  renderEmpty = <p>List is empty</p>,
  listItemKey = null,
}) => {
  if (!renderItem) {
    return <>Отсутствует функция рендера элементов массива.</>;
  }

  return data && data.length ? (
    <ul className={listClassName} style={styles}>
      {data.map((item, index) => (
        <li key={listItemKey ? item[listItemKey] : index}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  ) : (
    renderEmpty
  );
};

List.propTypes = {
  data: PropTypes.array,
  listClassName: PropTypes.string,
  styles: PropTypes.object,

  renderItem: PropTypes.func.isRequired,
  renderEmpty: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.func,
  ]),

  listItemKey: PropTypes.string,
};

export default List;
