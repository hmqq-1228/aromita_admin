import { get, post } from "../http.js";

//分类列表
export const categoryList = params =>get("backend/product/category",params);
//属性列表
export const attrList = params =>get("/backend/product/category/getCategoryAttributeList",params)
//新增分类
export const addCategory = params =>post("/backend/product/category",params)

// 分类对应关系
export const classlist = params =>get("/backend/product/webCategory",params)

export const coefficient = params =>get("/backend/product/profitCoefficient",params)
