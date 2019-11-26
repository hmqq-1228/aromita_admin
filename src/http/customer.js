import { get, post } from "../http.js";

//客户列表
export const customerList = params =>post("/backend/customer/list",params);

//积分明细
export const scoreDetail = params =>post("/backend/customer/score/detail",params)

//客户建议列表
export const suggestions = params =>post("/backend/suggestions/index",params)
//客户建议详情
export const suggestionsdetail = params =>post("/backend/suggestions/detail",params)