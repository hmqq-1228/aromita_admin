import { get, post ,deletes, put} from "../http.js";

// banner
export const getBannerList = params =>post("backend/home/index",params);
