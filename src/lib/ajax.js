import axios from 'axios'

axios.interceptors.request.use(function (config) {
  if (!config.data) config.data = {}
  // 在发送请求之前做些什么
  if (config.data instanceof FormData) {
    config.data.append('token', window.localStorage.token || '')
  } else {
    config.data = JSON.parse(JSON.stringify(config.data))
    config.data.token = config.data.token || window.localStorage.token || ''
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
axios.interceptors.response.use(function (res) {
  // 对响应数据做点什么
  // 如果返回403错误，则清空登录状态
  if (res.data.error && res.data.error.toString() === '403') {
    window.localStorage.token = ''
    window.location.reload()
  }
  // if (res.data.error && res.data.error.toString() !== '403') {
  //   window.alert(res.data.msg)
  // }
  // 如果用于下载文件时，返回整个对象，否则直接返回对象的数据部分
  // if (res.config.responseType === 'blob') {
  //   return res
  // } else {
  //   return res.data
  // }
  return res
}, function (error) {
  // 对响应错误做点什么
  window.alert(error.message)
  return Promise.reject(error)
})

export default axios
