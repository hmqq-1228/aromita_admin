import { get, post ,deletes, put} from "../http.js";

// banner
export const getBannerList = params =>post("backend/home/index",params);

// 新建Banner
export const addNewBanner = params =>post("backend/home",params);

// 商品
export const getProductsList = params =>post("backend/home/products/index",params);

// 新建商品
export const addNewProduct = params =>post("backend/home/products",params);

// 底部社交模块
export const shereTools = params =>get("backend/home/tools",params);
export const addNewSetting = params =>post("backend/home/tools",params);

