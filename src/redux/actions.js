import storeUtils from '../utils/storeUtils'
// import { reqLogin, reqLoginToken } from '../api'
import { message } from 'antd'
import {
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  LOGOUT,
  SAVE_USER
} from './action-types'

// 同步的action
// 1. 保存用户信息到redux
export const receive_user = user => ({ type: RECEIVE_USER, data: user })

// 2. 输出错误新
export const show_error_msg = msg => ({ type: SHOW_ERROR_MSG, data: msg })

// 3. 注销登录
export const logout = () => {
  // storeUtils.removeUser()
  localStorage.removeItem('token')
  console.log('logout action')
  return {
    type: LOGOUT
  }
}



// 异步action
// export const login = (username, password) => {
//   return async dispatch => {
//     const result = await reqLogin(username, password)
//     if (result.status === 0) {
//       message.success('登录成功!')
//       console.log('登录成功------')
//       const user = result.data
//       storeUtils.saveUser(user)
//       // 调用同步的保存user的action
//       dispatch(receive_user(user))
//     } else {
//       const msg = result.msg
//       dispatch(show_error_msg(msg))
//     }
//   }
// }

// 同步action, 保存用户信息
// const save_user = (value) => {
//   return {
//     type: SAVE_USER,
//     data: value
//   }
// }


// 异步action
// export const loginAsync = (username, password) => {
//   return async dispatch => {
//     let result = await reqLoginToken(username, password)
//     if (result.status === 0) {
//       localStorage.setItem('token', result.data)
//       dispatch(save_user(result.data))
//     } else {
//       message.error('失败')
//     }
//   }
// }