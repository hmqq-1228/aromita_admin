import { get, post } from "../http.js";

//售后订单列表
export const afterList = params =>get("/backend/refund",params);
//下拉框列表
export const SelectContent = params =>get("/backend/refund/getSelectContent",params)
