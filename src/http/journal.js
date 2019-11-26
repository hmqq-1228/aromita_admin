import { get, post} from "../http.js";

// banner
export const getJournalList = params =>get("/backend/log",params);

