import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import SideCart from "../../components/memo/SideCart";

import List from "../../utils/List";
import NumberWithUcoin from "../../utils/NumberWithUcoin";

import "../../static/css/productPageStyles.css";
import {
  BACKEND_PATH,
  CART_COUNT_ACTION,
  FETCH_METHOD,
} from "../../Consts";
import { addProductInfo } from "../../redux/actions/storeReducerDispatches/productActions";
import {
  deleteCartItem,
  setErrorCartItem,
  startFetchCartItem,
  updateUserCart,
} from "../../redux/actions/userReducerDispatches/cartActions";
import useFetch from "../../hooks/useFetch";
import useFetchWithAuth from "../../hooks/useFetchWithAuth";
import { autoClearProduct } from "../../redux/actions/storeActions";

const Product = () => {
  const { search } = useLocation();
  const responseGetParams = new URLSearchParams(search);

  const productId = responseGetParams.get("productId");

  if (!productId) {
    return (
      <div className="product-page container">
        <div>Url не содержит ID товара, проверьте его.</div>
      </div>
    );
  }

  const productInfo = useSelector(
    (store) => store.store.products[productId]
  );

  const dispatch = useDispatch();

  const type = responseGetParams.get("type");
  const [currentItem, setCurrentItem] = useState(null);

  const [fetchConfig, setFetchConfig] = useState({});
  const { error, data } = useFetch(fetchConfig);

  const changeCurrentSize = (index) => {
    if (productInfo && currentItem) {
      if (!productInfo.items_list[index]) {
        throw new Error(
          `Item with passed ${index} index does not exist.`
        );
      }

      setCurrentItem(productInfo.items_list[index]);
    }
  };

  useEffect(() => {
    if (!productInfo)
      setFetchConfig({
        url: `${BACKEND_PATH}/store/product/${productId}/`,
      });
  }, [productInfo]);

  useEffect(() => {
    if (data) {
      dispatch(addProductInfo(productId, data));
      dispatch(autoClearProduct(productId));
    }
  }, [data]);

  useEffect(() => {
    if (productInfo && productInfo.items_list && !currentItem) {
      const element = productInfo.items_list.filter(
        (item) => item.type === type
      );

      if (element.length) return setCurrentItem(element[0]);

      return setCurrentItem(productInfo.items_list[0]);
    }
  }, [productInfo, type]);

  return (
    <div className="product-page container">
      {error && (
        <div style={{ color: "red" }}>
          {JSON.stringify(productInfo.error)}
        </div>
      )}
      <div className="product__url-path">
        {productInfo && productInfo.collection_name ? (
          <>
            {currentItem ? (
              <>
                <Link to={"/store"}>Магазин</Link>
                <span className="slash">/</span>
                <Link to={`/store#${productInfo.collection_name}`}>
                  {productInfo.collection_name}
                </Link>
                <span className="slash">/</span>
                <span>
                  {productInfo.name} {currentItem.type}
                </span>
              </>
            ) : (
              <>
                <Link to={"/store"}>Магазин</Link>
                <span className="slash">/</span>
                <span>{productInfo.collection_name}</span>
              </>
            )}
          </>
        ) : (
          <span>Магазин</span>
        )}
      </div>
      <div className="product-wrapper">
        {/* {productInfo ? (
          <> */}
        <div className="product__info">
          <ProductPhotoComponent
            photoList={currentItem ? currentItem.photos : []}
          />
          <div className="description">
            {productInfo
              ? productInfo.description
              : "На этом месте появится описание товара"}
          </div>
        </div>
        <div className="product__header">
          <div className="product__name">
            {productInfo ? productInfo.name : "Название товара"}
          </div>
          <div className="product__price">
            <NumberWithUcoin
              number={productInfo ? productInfo.price : 0}
            />
          </div>
        </div>
        <div className="product__purchase">
          {productInfo && productInfo.items_list && currentItem ? (
            <>
              <div className="col-1">Тип</div>
              <List
                data={productInfo.items_list}
                listClassName="col-2 current-item-choose"
                renderItem={(item, index) => (
                  <>
                    <input
                      type="radio"
                      name="current-item"
                      id={`current-item-${index}`}
                      onChange={() => changeCurrentSize(index)}
                      value={item.type}
                      defaultChecked={currentItem.id === item.id}
                    />
                    <label htmlFor={`current-item-${index}`}>
                      {item.type}
                    </label>
                  </>
                )}
              />
              <ProductPurchaseComponent
                productId={productId}
                productHaveSize={productInfo.have_size}
                currentItem={currentItem}
              />
            </>
          ) : (
            <div
              style={{
                gridColumn: "1 / 3",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              Место для типов товаров
              <div
                className="lds-dual-ring"
                style={{ width: "50px" }}
              ></div>
            </div>
          )}
        </div>
        {/* </> */}
        {/* ) : (
          <>Can not load productInfo</>
        )} */}
      </div>
      <SideCart />
    </div>
  );
};

export default Product;

const ProductPhotoComponent = ({ photoList }) => {
  if (!photoList || !photoList.length) {
    return (
      <div className="product__photo empty-photo-list">
        Место для фотографий товара.
      </div>
    );
  }

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev + 1 === photoList.length ? 0 : prev + 1
    );
  };

  const previousPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? photoList.length - 1 : prev - 1
    );
  };

  return (
    <>
      <div className="product__photo">
        <List
          styles={{
            left: `-${100 * currentPhotoIndex}%`,
          }}
          data={photoList}
          renderItem={(item) => (
            <>
              <div
                className="item"
                style={{
                  backgroundImage: `url("${BACKEND_PATH}/media/images/${item}")`,
                }}
              ></div>
            </>
          )}
        />
        {photoList.length !== 1 && (
          <div className="btn-wrapper">
            <button
              className="prev btn"
              onClick={previousPhoto}
            ></button>
            <button className="next btn" onClick={nextPhoto}></button>
          </div>
        )}
      </div>

      {photoList.length !== 1 && (
        <List
          data={photoList}
          listClassName={"photo-toggler"}
          renderItem={(_, index) => (
            <input
              type={"radio"}
              value={index}
              name="photo"
              onChange={() => setCurrentPhotoIndex(() => index)}
              checked={currentPhotoIndex === index}
            />
          )}
        />
      )}
    </>
  );
};

ProductPhotoComponent.propTypes = {
  photoList: PropTypes.arrayOf(PropTypes.string),
};

const ProductPurchaseComponent = ({
  productId,
  productHaveSize,
  currentItem,
}) => {
  const [currentSizeIndex, setCurrentSizeIndex] = useState(
    productHaveSize ? 0 : null
  );

  return (
    <>
      {productHaveSize && (
        <>
          <div className="col-1">Размер</div>

          <List
            data={currentItem.sizes}
            listClassName="col-2 current-item-choose"
            renderItem={(item, index) => (
              <>
                <input
                  type="radio"
                  name="current-size"
                  id={`current-size-${index}`}
                  onClick={() => setCurrentSizeIndex(index)}
                  value={item}
                  defaultChecked={currentSizeIndex === index}
                />
                <label htmlFor={`current-size-${index}`}>
                  {item}
                </label>
              </>
            )}
          />
        </>
      )}

      {currentItem.in_stock ? (
        <ProductWithCartComponent
          productId={productId}
          type={currentItem.type}
          size={
            !isNaN(currentSizeIndex) && productHaveSize
              ? currentItem.sizes[currentSizeIndex]
              : null
          }
        />
      ) : (
        <p className="col-2">
          Товара нет на складе, попробуйте купить его позже.
        </p>
      )}
    </>
  );
};

ProductPurchaseComponent.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  currentItem: PropTypes.object.isRequired,
  productHaveSize: PropTypes.bool.isRequired,
};

const ProductWithCartComponent = ({ productId, size, type }) => {
  const [fetchConfig, setFetchConfig] = useState({});
  const { loading, error, data } = useFetchWithAuth(fetchConfig);

  const currentCartItem = useSelector((state) =>
    state.user.cart
      ? Object.entries(state.user.cart)
          .filter(
            ([, item]) =>
              item.product_id == productId &&
              item.type === type &&
              item.item_size === size
          )
          .map(([, value]) => value)[0]
      : null
  );

  const dispatch = useDispatch();

  const addCartItem = (productId, type, size) => {
    setFetchConfig({
      url: `${BACKEND_PATH}/store/cart/add/`,
      method: FETCH_METHOD.POST,
      data: {
        productId,
        type,
        size,
      },
    });
  };

  const changeItemCount = (cartItemId, action) => {
    setFetchConfig({
      url: `${BACKEND_PATH}/store/cart/manage/${cartItemId}/`,
      method: FETCH_METHOD.POST,
      data: {
        action,
      },
    });
  };

  const _deleteCartItem = (cartItemId) => {
    setFetchConfig({
      url: `${BACKEND_PATH}/store/cart/manage/${cartItemId}/`,
      method: FETCH_METHOD.DELETE,
    });
  };

  useEffect(() => {
    if (loading && currentCartItem) {
      dispatch(startFetchCartItem(currentCartItem.id));
    }
  }, [loading]);

  useEffect(() => {
    if (error && currentCartItem) {
      dispatch(setErrorCartItem(currentCartItem.id, error));
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      if (data.id) {
        dispatch(updateUserCart(data));
      } else {
        dispatch(deleteCartItem(data));
      }
    }
  }, [data]);

  if (!currentCartItem) {
    return (
      <>
        {loading ? (
          <div
            className="lds-dual-ring col-2"
            style={{ width: "50px" }}
          ></div>
        ) : error ? (
          <div style={{ color: "red", fontSize: ".8em" }}>
            {JSON.stringify(currentCartItem.error)}
          </div>
        ) : (
          <button
            className="purchase-btn col-2"
            onClick={() => addCartItem(productId, type, size)}
          >
            Добавить в корзину
          </button>
        )}
      </>
    );
  }

  return (
    <div className="manage-cart-item col-2">
      <div className="count-manage">
        <button
          onClick={() => {
            if (currentCartItem.count === 1) {
              _deleteCartItem(currentCartItem.id);
            } else {
              changeItemCount(
                currentCartItem.id,
                CART_COUNT_ACTION.REMOVE
              );
            }
          }}
          disabled={currentCartItem.count === 0 || error || loading}
          className="decrease-btn"
        >
          −
        </button>
        <span className="count">{currentCartItem.count}</span>
        <button
          onClick={() =>
            changeItemCount(currentCartItem.id, CART_COUNT_ACTION.ADD)
          }
          disabled={currentCartItem.count === 10 || error || loading}
          className="increase-btn"
        >
          +
        </button>
      </div>
      {currentCartItem.loading && (
        <div
          className="lds-dual-ring"
          style={{ width: "1.3em" }}
        ></div>
      )}

      {currentCartItem.error && (
        <div
          style={{
            color: "red",
            fontSize: ".8em",
            flexBasis: "100%",
          }}
        >
          {JSON.stringify(currentCartItem.error)}
        </div>
      )}
    </div>
  );
};

ProductWithCartComponent.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  type: PropTypes.string.isRequired,
  size: PropTypes.string,
};
