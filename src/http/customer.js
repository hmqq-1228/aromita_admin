import { get, post } from "../http.js";

//客户列表
export const customerList = params =>post("/backend/customer/list",params);

//积分明细
export const scoreDetail = params =>post("/backend/customer/score/detail",params)