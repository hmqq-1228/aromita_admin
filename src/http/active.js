import { get, post ,deletes, put} from "../http.js";

//新建活动
export const newActive = params =>post("/backend/activity/insert",params);

//活动列表
export const activeList = params =>post("/backend/activity/index",params)

//活动终止
export const activestop = params =>get("/backend/activity/stop",params)

//编辑活动获取详情
export const activedetail = params =>get("/backend/activity/edit",params)

//修改活动详情
export const activeUpdate = params =>post("/backend/activity/update",params)

//活动商品列表
export const activitySku = params =>post("/backend/activitySku/index",params)

//活动详情
export const activelistdetail = params =>post("/backend/activity/detail",params)

//删除活动商品
export const delactiveSku = params =>post("/backend/activitySku/del",params)

//批量删除活动商品
export const batchdelactiveSku = params =>post("/backend/activitySku/batchDel",params)

//终止活动商品 
export const stopactiveSku = params =>post("/backend/activitySku/stop",params)

//批量终止活动商品
export const batchstopactiveSku = params =>post("/backend/activitySku/batchStop",params)

//添加活动商品弹框
export const activitySkuindex = params =>post("/backend/activitySku/activitySkuindex",params)

//添加活动商品
export const addactiveSku = params =>post("/backend/activitySku/activitySkuinsert",params)

//保存活动广场样式
export const saveActiveStyle = params =>post("/backend/activity/square",params) 

//编辑活动广场获取详情
export const detailStyle = params =>get("/backend//activity/squareEdit",params)

