import { get, post } from "../http.js";

//优惠券列表
export const couponList = params =>post("/backend/coupon/list",params);

//创建优惠券
export const addCoupon = params =>post("/backend/coupon/create",params)

//删除优惠券
export const delCoupon = params =>post("/backend/coupon/delete",params)

//终止优惠券
export const stopCoupon = params =>post("/backend/coupon/stop",params)