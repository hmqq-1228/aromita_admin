import axios from "axios";
import qs from "qs";
import Router from '@/router/index'


if(process.env.NODE_ENV === 'production'){
  axios.defaults.baseURL = window.location.protocol + '//' + window.location.hostname
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
  if (response.data.code === 30001) {
    Router.push('/')
  } else {
    return response
  }
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

export const put = (url, params, config = {}) => {
    return axios({
        method: 'put',
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
