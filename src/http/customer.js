import { get, post } from "../http.js";

//客户列表
export const customerList = params =>get("/backend/customer/list",params);

//筛选客户
export const searchList = params =>post("/backend/customer/search",params)

//客户详情
export const customerDetail = params =>get("/backend/customer/detail",params)