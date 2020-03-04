let initGroupState = []

export default function group(state = initGroupState, action) {
  let { type, data } = action
  switch (type) {
    case 'SAVE_GROUP':
      return data
    default:
      return state
  }
}