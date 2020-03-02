import { combineReducers } from 'redux';
import user from './user-reducers'
import menu from './menu-reducers'

export default combineReducers({
  user,
  menu
})
