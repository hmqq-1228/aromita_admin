import { get, post } from "../http.js";

//上传图片
export const uploadUrl = `${process.env.API_ROOT}/backend/upload`
//sku列表
export const skuList = params =>get("backend/product/sku",params);
//spu列表
export const spuList = params =>get("backend/product/",params)
//输入sku后获取erp信息
export const skuerp = params =>get("backend/product/sku/skuQuery",params)
//sku_no 智能匹配
export const skunoList = params =>get("backend/product/sku/skuNoQuery",params)
//获取属性属性值列表 （sku创建用）
export const attrEdition = params =>get("/backend/product/attr/skuAttributeList",params)