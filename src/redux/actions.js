import { INCREMENT } from './action-types'

export const increment = num => ({
  type: INCREMENT,
  payload: num
})