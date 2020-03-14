import { reqLogin } from "../../api"
import { SAVE_USER, LOGOUT } from '../action-types'
import { message } from 'antd'

// 登录后保存用户信息
const save_user = data => ({ type: SAVE_USER, data })

// 注销
export const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  return {
    type: LOGOUT,
    data: ''
  }
}

// -------------------- 异步action --------------------
// 登录
export const loginAsync = (username, password) => {
  return async dispatch => {
    const { status, data, msg } = await reqLogin(username, password)
    if (status === 0) {
      // 本地持久化, 页面一刷新, 状态数据就没了
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      // 派发action redux保存一份
      dispatch(save_user(data))
    } else {
      message.warning(`登录失败,${msg}`)
    }
  }
}