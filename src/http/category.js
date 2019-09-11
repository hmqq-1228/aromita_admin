import { get, post } from "../http.js";

//分类列表
export const categoryList = params =>get("backend/product/category",params);
//创建新属性
// export const addAttr = params =>post("backend/product/attr",params)