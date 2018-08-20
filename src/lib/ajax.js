import axios from 'axios'
import toast from '../components/toast'
import utils from './utils'

// config自定义参数:
// dontToast:bool:不显示默认的错误toast
// checkLogin:bool:检查登陆
axios.defaults.method = 'post'
const loginText = '请登录'
axios.interceptors.request.use(function (config) {
  if (config.checkLogin) {
    if (!utils.checkLogin()) {
      return Promise.reject(loginText)
    }
  }
  if (!config.data) config.data = {}
  // 在发送请求之前做些什么
  // window.localStorage.token = 'c46bb5b5d0f54013bcdf75a6ebf967b1'
  if (config.data instanceof FormData) {
    config.data.append('token', config.data.token || window.localStorage.token || '')
  } else {
    config.data = JSON.parse(JSON.stringify(config.data))
    config.data.token = config.data.token || window.localStorage.token || ''
    config.data.origin = 'H5'
  }
  if (config.token || config.data.token) { // 如果传入了token，将token放入headers中
    config.headers.token = config.token || config.data.token
  }
  if (config.contentType) {
    config.headers['Content-Type'] = config.contentType
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
axios.interceptors.response.use(function (res) {
  // 对响应数据做点什么
  // 如果返回403错误，则清空登录状态
  if (res.data.error && (res.data.error.toString() === '403' || res.data.error.toString() === '401')) {
    window.localStorage.token = ''
    utils.checkLogin()
    return Promise.reject(loginText)
  }
  if (res.data.msg && res.data.error !== 0 && res.data.error !== '0') {
    if (res.config.dontToast !== true) {
      toast(res.data.msg, 2000, () => { });
    }
    return Promise.reject(res)
  }

  // 如果用于下载文件时，返回整个对象，否则直接返回对象的数据部分
  if (res.config.responseType === 'blob') {
    return res
  } else {
    return res.data
  }
}, function (error) {
  // 对响应错误做点什么
  if (error.message) {
    window.alert(error.message)
  }
  return Promise.reject(error)
})

export default axios
