import { get, post ,deletes, put} from "../http.js";

//广告列表
export const advertlist = params =>post("/backend/advert/index",params);

//新建顶部浮窗广告
export const addAdvert = params =>post("/backend/advert/insert",params);

//编辑顶部广告
export const editadvert = params =>post("/backend/advert/edit",params)

//广告修改
export const updatEdit = params =>post("/backend/advert/update",params)

//订阅广告
export const subscribe = params =>post("/backend/subscribe/index",params)

//订阅广告设置
export const setSubscribe = params =>post("/backend/subscribe/set",params)

