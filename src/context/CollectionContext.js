import React, { useState } from "react";
import PropTypes from "prop-types";

const CollectionContext = React.createContext();

export default CollectionContext;

export const CollectionProvider = ({ children, collections }) => {
  if (!collections) return <>{children}</>;

  const [collection, setCollection] = useState(collections[0]);

  const changeCurrentVisibleCollection = (collectionName) => {
    if (!collections.includes(collectionName)) {
      throw new Error("New Collection does not exist!");
    }

    if (collection !== collectionName) {
      setCollection(collectionName);
    }
  };

  return (
    <CollectionContext.Provider
      value={{
        collection,
        changeCurrentVisibleCollection,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

CollectionProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  collections: PropTypes.arrayOf(PropTypes.string),
};
