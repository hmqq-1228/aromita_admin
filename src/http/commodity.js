import { get, post } from "../http.js";

//sku列表
export const skuList = params =>get("backend/product/sku",params);

//spu列表
export const spuList = params =>get("backend/product/",params)
