import { combineReducers } from 'redux'
import { INCREMENT } from './action-types'

const initCount = 0
function counter(state = initCount, action) {
  switch (action.type) {
    case INCREMENT:
      return state + action.payload
    default:
      return state
  }
}


const initUser = {
  name: 'sanfeng'
}
function user(state = initUser, action) {
  return state
}

export default combineReducers({
  counter,
  user
})
