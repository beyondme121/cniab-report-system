import { SAVE_USER, LOGOUT } from '../action-types'

let _user = JSON.parse(localStorage.getItem('user'))
let _token = localStorage.getItem('token')

let initUser = {
  user: _user || {},
  token: _token || '',
  isLogin: _user && _token ? true : false
}

function userReducer(state = initUser, action) {
  let { type, data } = action
  switch (type) {
    // 登录成功保存用户信息
    case SAVE_USER:
      return {
        user: data.user,
        token: data.token,
        isLogin: true
      }
    case LOGOUT:
      return {
        user: {},
        token: ''
      }
    default:
      return state
  }
}

export default userReducer