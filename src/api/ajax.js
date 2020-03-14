import axios from 'axios'
import { message } from 'antd'
import store from '../redux/store'
import { logout } from '../redux/actions/user-actions'

// 请求拦截器, 给请求添加token验证的Authorization
axios.interceptors.request.use(config => {
  let token = store.getState().user.token || localStorage.getItem('token') || ''
  config.headers.common['Authorization'] = 'Bearer ' + token
  return config
})

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response.status === 401) {
      message.error(`Protected resource, Please login, ${error.message}`, 1)
      store.dispatch(logout())
    } else {
      message.error(`请求出错了: ${error.message}`, 3)
    }
    return new Promise(() => { })
  }
)

export default function ajax(url, data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    let promise
    // 异步请求
    if (method === 'GET') {
      promise = axios.get(url, { params: data })
    } else {
      promise = axios({
        url,
        method,
        data
      })
    }
    // 异常处理
    promise
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        message.error(`请求出错了: ${err.message}`, 5)
      })
  })
}
