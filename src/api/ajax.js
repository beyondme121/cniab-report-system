import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    let promise
    // 异步请求
    if (method === 'GET') {
      promise = axios.get(url, { params: data })
    } else {
      promise = axios.post(url, data)
    }
    // 异常处理
    promise
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        message.error("请求出错了: ", err.message)
      })

  })

}
