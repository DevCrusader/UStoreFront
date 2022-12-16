import React, {
  useContext,
  useEffect,
  useRef,
  useReducer,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchCollectionProducts } from "../redux/actions/storeActions";
import PropTypes from "prop-types";
import CollectionContext from "../context/CollectionContext";
import { Link, useLocation } from "react-router-dom";

import List from "../utils/List";
import { BACKEND_PATH } from "../Consts";
import NumberWithUcoin from "../utils/NumberWithUcoin";
import useFetch from "../hooks/useFetch";
import { setCollectionProducts } from "../redux/actions/storeReducerDispatches/collectionActions";

const CollectionInStore = ({
  collectionName = undefined,
  userVisibilityLine = 0,
}) => {
  const { collection, changeCurrentVisibleCollection } =
    useContext(CollectionContext);

  const collectionInfo = useSelector((state) =>
    state.store.collections
      ? state.store.collections[collectionName]
      : "Nothing to see"
  );
  const dispatch = useDispatch();

  const [fetchConfig, setFetchConfig] = useState({});
  const { loading, error, data } = useFetch(fetchConfig);

  const { hash } = useLocation();

  const containerRef = useRef(null);
  const containerYRect = useRef(null);

  useEffect(() => {
    if (data) dispatch(setCollectionProducts(collectionName, data));
  }, [data]);

  useEffect(() => {
    if (
      collection === collectionName &&
      collectionInfo.products === null
    ) {
      setFetchConfig({
        url: `${BACKEND_PATH}/store/products/?collection=${collectionName}`,
      });
    }
  }, [collection, collectionInfo]);

  useEffect(() => {
    if (containerRef?.current) {
      containerYRect.current = (() => {
        const _rect = containerRef.current.getBoundingClientRect();
        return {
          top: _rect.top + window.scrollY,
          bottom: _rect.bottom + window.scrollY,
        };
      })();

      const scrollHandler = () => {
        const curUserYPos = window.scrollY + userVisibilityLine;
        if (
          containerYRect.current.top < curUserYPos &&
          curUserYPos < containerYRect.current.bottom
        )
          changeCurrentVisibleCollection(collectionName);
      };

      window.addEventListener("scroll", scrollHandler);
      return () =>
        window.removeEventListener("scroll", scrollHandler);
    }
  }, [containerRef, collectionInfo, changeCurrentVisibleCollection]);

  useEffect(() => {
    if (containerYRect)
      if (hash && hash.substring(1) === collectionName)
        scrollTo({
          behavior: "smooth",
          left: 0,
          top: containerYRect.current.top - 0.8 * userVisibilityLine,
        });
  }, [containerYRect, hash]);

  return (
    <>
      {collectionInfo ? (
        <div
          className={"collection"}
          id={collectionName}
          ref={containerRef}
        >
          <header>КОЛЛЕКЦИЯ: {collectionName}</header>

          {error ? (
            <div className="error">{JSON.stringify(error)}</div>
          ) : (
            <List
              data={
                collectionInfo.products !== null
                  ? collectionInfo.products
                  : Array(6).fill(1)
              }
              listClassName={
                collectionInfo.products !== null ? "" : "stub"
              }
              renderItem={(item) => (
                <>
                  {collectionInfo.products !== null ? (
                    <ProductCard product={item} />
                  ) : (
                    <>
                      {loading && (
                        <div className="loader">
                          <div
                            className=" lds-dual-ring"
                            style={{
                              width: "40%",
                              "--loader-color": "gray",
                            }}
                          ></div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            />
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

CollectionInStore.propTypes = {
  collectionName: PropTypes.string,
  userVisibilityLine: PropTypes.number,
  onChangeVisibility: PropTypes.func,
};

export default CollectionInStore;

const ProductCard = ({ product }) => {
  const { id, name, price, photo_list } = product;

  const [currentPhotoIndex, setNextCurrentPhotoIndex] = useReducer(
    (state) => {
      console.log(state);
      const newState =
        state === product.photo_list.length - 1 ? 0 : state + 1;
      console.log(newState);
      return newState;
    },
    0
  );

  useEffect(() => {
    console.log(product.photo_list);

    const intervalId = setInterval(() => {
      setNextCurrentPhotoIndex();
    }, 2000);

    return clearInterval(intervalId);
  }, [product]);

  return (
    <Link to={`/product/?productId=${id}`}>
      <div className="product__card">
        <div className="product__name">{name}</div>
        <div className="product__price" style={{ marginTop: "5px" }}>
          <NumberWithUcoin number={price} changeFontSize="1.5" />
        </div>
        <img
          src={`${BACKEND_PATH}/media/images/${photo_list[currentPhotoIndex]}`}
          alt={`Товар ${name}.`}
        />
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object,
};
