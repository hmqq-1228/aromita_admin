import { get, post ,deletes, put} from "../http.js";

//热搜词列表
export const hotwordList = params =>post("/backend/hotword/list",params);

//新建热搜词
export const createHotword = params =>post("/backend/hotword/create",params);

//删除热搜词
export const deleteHotword = params =>post("/backend/hotword/delete",params);


