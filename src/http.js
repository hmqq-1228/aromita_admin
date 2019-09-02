import axios from "axios";
import qs from "qs";

if(process.env.API_ROOT){
    axios.defaults.baseURL = process.env.API_ROOT;
}else{
    axios.defaults.baseURL = ''
}
//本地开发
axios.defaults.timeout = 60 * 1000;

// request全局拦截
axios.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
});

// response全局拦截
axios.interceptors.response.use(response => {
    return response.data
}, error => {
    return Promise.reject(error.response)
});

export const post = (url, params, config = {}) => {
    return axios({
        method: 'post',
        url: url,
        data: qs.stringify(params)
    })
}

export const get = (url,params,config = {}) => {
    return axios({
        method: 'get',
        url: url,
        params: params
    })

}

export const deletes = (url, params, config = {}) => {
    return axios({
        method: 'delete',
        url: url,
        params: params
    })
}

export const baseURL = axios.defaults.baseURL;
