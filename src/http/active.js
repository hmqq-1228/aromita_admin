import { get, post ,deletes, put} from "../http.js";

//新建活动
export const newActive = params =>post("/backend/activity/insert",params);

//活动列表
export const activeList = params =>post("/backend/activity/index",params)

//活动终止
export const activestop = params =>get("/backend/activity/stop",params)

//编辑活动获取详情
export const activedetail = params =>get("/backend/activity/edit",params)