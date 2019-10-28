import { get, post ,deletes, put} from "../http.js";

//筛选条件列表
export const getSystemList = params =>post("/backend/attr/list",params);

//获取筛选条件详情
export const atrrEdit = params =>post("/backend/attr/edit",params)

//筛选条件校验
export const attrSet = params =>post("/backend/attr/setting",params)

//保存系统设置
export const attrUpdate = params =>post("/backend/attr/update",params)