import { get, post } from "../http.js";

//订单列表
export const orderList = params =>post("/backend/order/list",params);

//订单详情
export const orderDetail = params =>post("/backend/order/detail",params)

//编辑获取订单
export const orderUpdate = params =>post("/backend/order/update",params)

//修改订单状态
export const orderEdit = params =>post("/backend/order/edit",params)

//取消付款订单插入接口
export const refundInsert = params =>post("/backend/refund/insert",params)

// 登陆
export const userLogin = params =>post("/backend/admin/login",params)

//取消订单
export const cancelorder = params =>post("/backend/order/cancel",params)

export const refundOrder = params =>get("/backend/paypal-refund",params)

//取消订单列表
export const refundIndex = params =>post("/backend/refund/index",params)

//取消订单详情
export const refundDetail = params =>post("/backend/refund/detail",params)