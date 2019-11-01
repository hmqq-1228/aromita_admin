import { get, post ,deletes, put} from "../http.js";

//热搜词列表
export const hotwordList = params =>post("/backend/hotword/list",params);

//新建热搜词
export const createHotword = params =>post("/backend/hotword/create",params);

//删除热搜词
export const deleteHotword = params =>post("/backend/hotword/delete",params);

//链接词列表
export const linkwordList = params =>post("/backend/linkword/index",params)

//下架链接词
export const downLinkword = params =>post("/backend/linkword/xiajia",params)

//删除链接词
export const deleteLinkword = params =>post("/backend/linkword/delete",params)

//新建链接词
export const createdLink = params =>post("/backend/linkword/create",params)

//链接词活动新建列表
export const activityindex = params =>post("/backend/linkword/activityindex",params)