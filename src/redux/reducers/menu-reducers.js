import { SAVE_MENU } from '../action-types'

function menu(state = [], action) {
  switch (action.type) {
    case SAVE_MENU:
      return action.data
    default:
      return state
  }
}

export default menu;