import { get, post } from "../http.js";

//权限列表
export const userIndex = params =>post("/backend/user/index",params);

//新建权限
export const createUser = params =>post("/backend/user/create",params)

//权限编辑
export const editUser = params =>post("/backend/user/edit",params)

//权限修改
export const updateUser = params =>post("/backend/user/update",params)

//重置密码
export const resetUserPass = params =>post("/backend/user/resetpass",params)

//开启角色状态
export const getonstatus = params =>post("/backend/user/getonstatus",params)

//角色管理列表页
export const roleIndex = params =>post("/backend/role/index",params)

//新建角色
export const createRole = params =>post("/backend/role/create",params)

//修改角色
export const updateRole = params =>post("/backend/role/update",params)

//角色管理权限分配显示
export const fqRole = params =>post("/backend/role/fq",params)

//角色管理权限分配
export const dofqRole = params =>post("/backend/role/dofq",params)