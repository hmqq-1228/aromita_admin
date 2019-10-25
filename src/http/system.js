import { get, post ,deletes, put} from "../http.js";

//筛选条件列表
export const getSystemList = params =>post("/backend/attr/list",params);
