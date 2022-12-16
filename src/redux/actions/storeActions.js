import { TOKEN_LIFE_TIME } from "../../Consts";
import { clearCollections } from "./storeReducerDispatches/collectionActions";
import { deleteProduct } from "./storeReducerDispatches/productActions";

export const autoClearCollections = () => {
  return async (dispatch) => {
    setTimeout(() => {
      dispatch(clearCollections());
    }, (TOKEN_LIFE_TIME / 2) * 1000);
  };
};

export const autoClearProduct = (productId) => {
  console.log("Create timeout 1", productId);

  return async (dispatch) => {
    console.log("Create timeout 2");

    setTimeout(() => {
      console.log("Clear");

      dispatch(deleteProduct(productId));
    }, (TOKEN_LIFE_TIME / 2) * 1000);
  };
};
