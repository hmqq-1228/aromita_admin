import { get, post ,deletes, put} from "../http.js";

//上传图片
export const uploadUrl = `${process.env.API_ROOT}/backend/upload`

//sku列表
export const skuList = params =>get("backend/product/sku",params);

//spu列表
export const spuList = params =>get("backend/product/",params)

//批量删除sku
export const deleteSkuBatch = params =>deletes("/backend/product/sku/ajaxBatchDelete",params)

//批量删除spu
export const deleteSpuBatch = params =>deletes("/backend/product/ajaxBatchDelete",params)

//spu单个上货和批量上货
export const spuGoods = params =>put("/backend/product/ajaxUpdateStatus",params)

//sku上下架
export const skuGoods = params =>put("/backend/product/sku/ajaxUpdateStatus",params)

//输入sku后获取erp信息
export const skuerp = params =>get("backend/product/sku/skuQuery",params)

//sku_no 智能匹配
export const skunoList = params =>get("backend/product/sku/skuNoQuery",params)

//获取属性属性值列表 （sku创建用）
export const attrEdition = params =>get("/backend/product/attr/skuAttributeList",params)

//新建spu
export const addSpuList = params =>post("/backend/product",params)

//编辑spu
export const aditSpuList = params =>put("/backend/product",params)

//设置图片
export const settingSave = params => post("/backend/product/sku/settingSave",params)

//新建sku
export const addNewSku = params =>post("/backend/product/sku",params)

//sku启用
export const skuSetEnable = params =>put("/backend/product/sku/ajaxSetEnable",params)

//sku禁用
export const skuSetDisable = params =>put("/backend/product/sku/ajaxSetDisable",params)

//批量新建SKU
export const batchCreate = params =>post("/backend/product/sku/batchCreate",params)
export const batchgetCount = params =>get("/backend/product/sku/getCount",params)

//保存属性排序
export const saveAttrSort = params =>post("/backend/product/sku/settingSaveSort",params)

//标签列表
export const sceneTag = params =>get("/backend/product/sceneTag",params)

//新建时获取一级标签
export const TagFirstCategory = params =>get("/backend/product/sceneTag/ajaxFirstCategory",params)

//新建标签
export const newSceneTag = params =>post("/backend/product/sceneTag",params)

//查看标签
export const viewSceneTag = params =>get("/backend/product/sceneTag",params)

//编辑标签
export const updataSceneTag = params =>put("/backend/product/sceneTag",params)

//spu设置获取标签
export const spuTagList = params =>get("/backend/product/sceneTag/spuTagList",params)
