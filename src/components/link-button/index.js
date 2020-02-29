import React from 'react'
import './index.less'

// LinkButton的子组件会作为props的children属性传递给LinkButton
export default function LinkButton(props) {
  return <button className="link-button" {...props} />
}


// export default function LinkButton(props) {
//   return <button className="link-button">
//     {props.children}
//   </button>
// }
