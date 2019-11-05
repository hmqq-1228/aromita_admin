import { get, post } from "../http.js";

//订单列表
export const orderList = params =>post("/backend/order/list",params);

//订单详情
export const orderDetail = params =>post("/backend/order/detail",params)

//编辑获取订单
export const orderUpdate = params =>post("/backend/order/update",params)

//修改订单状态
export const orderEdit = params =>post("/backend/order/edit",params)

// 登陆
export const userLogin = params =>post("/backend/admin/login",params)

