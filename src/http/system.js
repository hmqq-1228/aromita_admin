import { get, post ,deletes, put} from "../http.js";

//筛选条件列表
export const getSystemList = params =>post("/backend/attr/list",params);

//获取筛选条件详情
export const atrrEdit = params =>post("/backend/attr/edit",params)

//筛选条件校验
export const attrSet = params =>post("/backend/attr/setting",params)

//保存系统设置
export const attrUpdate = params =>post("/backend/attr/update",params)

//售后原因

//售后原因列表
export const afterList = params =>post("/backend/rr/list",params)

//创建售后服务
export const createdSale = params =>post("/backend/rr/create",params)

//单个删除售后
export const deleteSale = params =>post("/backend/rr/delete",params)

//批量删除
export const batchdeleteSale = params =>post("/backend/rr/batchdelete",params)

//编辑售后获取详情
export const saledetail = params =>post("/backend/rr/edit",params)

//编辑售后提交
export const saledetailSub = params =>post("/backend/rr/update",params)