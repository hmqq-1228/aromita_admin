import { get, post } from "../http.js";

//属性列表
export const attrList = params =>get("backend/product/attr",params);
//创建新属性
export const addAttr = params =>post("backend/product/attr",params)
