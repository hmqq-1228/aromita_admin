import { get, post } from "../http.js";

//订单列表
export const orderList = params =>post("/backend/order/list",params);

//订单详情
export const orderDetail = params =>post("/backend/order/detail",params)

//