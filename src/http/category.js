import { get, post } from "../http.js";

//分类列表
export const categoryList = params =>get("backend/product/category",params);

//属性列表（分类编辑用）
export const categoryAttrList = params =>get("/backend/product/category/getCategoryAttributeList",params)

//新增分类
export const addCategory = params =>post("/backend/product/category",params)

// 分类对应关系
export const classlist = params =>get("/backend/product/webCategory",params)

//获取分类的一级类目
export const ClassII = params =>get("/backend/product/category/ajaxSecondCategory",params)

//获取分类的一级类目
export const ClassI = params =>get("/backend/product/category/ajaxFirstCategory",params)

//由一级类目获取二级类目
export const Classlinkage = params =>get("/backend/product/category/getAjaxCategoryByParentId",params)

//创建对应关系
export const addCategorylist = params => post("/backend/product/webCategory",params)

//利润关系
export const coefficient = params =>get("/backend/product/profitCoefficient",params)
