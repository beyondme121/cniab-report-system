import { combineReducers } from 'redux'
import storeUtils from '../utils/storeUtils'
import { RECEIVE_USER, LOGOUT, SAVE_USER } from './action-types'

// const initUser = storeUtils.getUser()
const initUser = localStorage.getItem('token') || ''

function user(state = initUser, action) {
  switch (action.type) {
    case RECEIVE_USER:
      return action.data
    case SAVE_USER:
      return action.data
    case LOGOUT:
      return ''
    default:
      return state
  }
}

export default combineReducers({
  user
})














// const initCount = 0
// function counter(state = initCount, action) {
//   switch (action.type) {
//     case INCREMENT:
//       return state + action.payload
//     default:
//       return state
//   }
// }
