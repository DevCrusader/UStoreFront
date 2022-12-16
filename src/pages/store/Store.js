import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CollectionInStore from "../../components/CollectionInStore";
import NavigationSideBar from "../../components/NavigationSideBar";
import { CollectionProvider } from "../../context/CollectionContext";

import List from "../../utils/List";

import "../../static/css/storeStyle.css";
import SideCart from "../../components/memo/SideCart";
import useFetch from "../../hooks/useFetch";
import { BACKEND_PATH } from "../../Consts";
import { uploadCollection } from "../../redux/actions/storeReducerDispatches/collectionActions";
import { autoClearCollections } from "../../redux/actions/storeActions";

const Store = () => {
  const collections = useSelector((state) => state.store.collections);
  const dispatch = useDispatch();

  const [collectionsName, setCollectionsName] = useState([]);

  const userVisibilityLine = 150;

  const [fetchConfig, setFetchConfig] = useState({});
  const { error, data } = useFetch(fetchConfig);

  useEffect(() => {
    setCollectionsName(collections ? Object.keys(collections) : []);
  }, [collections]);

  useEffect(() => {
    if (collections === null) {
      setFetchConfig({
        url: `${BACKEND_PATH}/store/collections/`,
      });
    }
  }, [collections]);

  useEffect(() => {
    console.log("DATA: ", data);
    if (data) {
      dispatch(uploadCollection(data));
      dispatch(autoClearCollections());
    }
  }, [data]);

  return (
    <div
      className={`store-page container ${
        collectionsName.length ? "" : "stub"
      }`}
    >
      <div className="store-decoration"></div>
      <div className="store-wrapper">
        {collectionsName.length ? (
          <CollectionProvider collections={collectionsName}>
            <div className="collections-wrapper">
              {collectionsName.map((collection, index) => (
                <CollectionInStore
                  key={index}
                  collectionName={collection}
                  userVisibilityLine={userVisibilityLine}
                />
              ))}
            </div>
            <div className="navbar-wrapper">
              {collectionsName && (
                <NavigationSideBar
                  collections={collectionsName}
                  userVisibleLine={userVisibilityLine}
                />
              )}

              <SideCart />
            </div>
          </CollectionProvider>
        ) : (
          <>
            <div className="collections-wrapper">
              <div className="collection">
                <header>МАГАЗИН КОРПОРАТИВНОГО МЕРЧА</header>
                <List
                  data={Array(3).fill(1)}
                  renderItem={() => <></>}
                />
              </div>
            </div>
            <div className="navbar-wrapper">
              {error ? (
                <>
                  <p>Не удалось загрузить данные с сервера.</p>
                  <p style={{ color: "red" }}>
                    {JSON.stringify(error)}
                  </p>
                  <p>
                    Произошла ошибка или на данный момент нет
                    коллекций, в которых есть товары.
                  </p>
                  <p>Повторите попытку позже.</p>
                </>
              ) : (
                <>
                  <div
                    className="lds-dual-ring"
                    style={{ width: "60%", margin: "20px 0" }}
                  ></div>
                  <p>Loading...</p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Store;
