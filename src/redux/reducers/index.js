import { combineReducers } from 'redux';
import user from './user-reducers'
import menu from './menu-reducers'
import group from './group-reducers'

export default combineReducers({
  user,
  menu,
  group
})
