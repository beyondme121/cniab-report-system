// import storeUtils from '../../utils/storeUtils'
import { RECEIVE_USER, LOGOUT, SAVE_USER } from '../action-types'

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

export default user