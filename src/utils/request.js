import axios from 'axios'
import router from '@/router/routers'
import { Notification } from 'element-ui'
import store from '../store'
import { getToken, setToken } from '@/utils/auth'
import Config from '@/settings'
import Cookies from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  timeout: Config.timeout // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // eslint-disable-next-line no-unused-vars
    var urlStr = ''
    // switch (config.url) {
    //   case 'auth/code':
    //     urlStr = '获取验证码'
    //     break
    //   case 'auth/login':
    //     urlStr = '登录'
    //     break
    // }
    // console.log('<=========================================')
    // console.log('请求接口名称:', urlStr)
    // console.log('请求url: ', config.url)
    // console.log('请求参数: ', config.data)
    if (getToken()) {
      // 设置请求 token 的 head ；key 要和后端解析的一致
      config.headers['X-Authorization-With'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    Promise.reject(error)
  }
)
// response 拦截器
service.interceptors.response.use(
  response => {
    // var obj = response.data
    // console.log('请求结果: ', obj)
    // console.log('=========================================>')
    // 如果返回的状态码不是 1000 就是有问题的请求
    if (response.data.code !== 1000) {
      // 弹出错误弹窗
      Notification.error({
        title: response.data.message,
        duration: 5000
      })
      return Promise.reject(response.data)
    }
    if (response.headers['x-authorization-with']) {
      // 如果响应体中有 刷新的 token 就保存在 cookie 中
      setToken(response.headers['x-authorization-with'])
      // 把token 存储在 vuex 中，这里其实方式不太对，以后有好的方式替换 token 存储时机
      store.commit('SET_TOKEN', response.headers['x-authorization-with'])
      console.log('token: ', store.getters.token)
    }
    return response.data.data
  },
  error => {
    // 兼容blob下载出错json提示
    if (error.response.data instanceof Blob && error.response.data.type.toLowerCase().indexOf('json') !== -1) {
      const reader = new FileReader()
      reader.readAsText(error.response.data, 'utf-8')
      reader.onload = function(e) {
        const errorMsg = JSON.parse(reader.result).message
        Notification.error({
          title: errorMsg,
          duration: 5000
        })
      }
    } else {
      let code = 0
      try {
        code = error.response.data.status
      } catch (e) {
        if (error.toString().indexOf('Error: timeout') !== -1) {
          Notification.error({
            title: '网络请求超时',
            duration: 5000
          })
          return Promise.reject(error)
        }
      }
      console.log(code)
      if (code) {
        if (code === 401) {
          store.dispatch('LogOut').then(() => {
            // 用户登录界面提示
            Cookies.set('point', 401)
            location.reload()
          })
        } else if (code === 403) {
          router.push({ path: '/401' })
        } else {
          const errorMsg = error.response.data.message
          if (errorMsg !== undefined) {
            Notification.error({
              title: errorMsg,
              duration: 5000
            })
          }
        }
      } else {
        Notification.error({
          title: '接口请求失败',
          duration: 5000
        })
      }
    }
    return Promise.reject(error)
  }
)
export default service
