import React from 'react'
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import useMousePosition from '../../test/test-hook-selfdefine'
// import TestExport from '../../test/test-export-data'
import Order from './order'
import Revenue from './revenue'


export default function Home() {
  const position = useMousePosition()
  return (
    <Switch>
      <Route path='/dashboard/order' component={Order} />
      <Route path='/dashboard/revenue' component={Revenue} />
      {/* <div>
        <h1 style={{ fontSize: 10 }}>使用自定义hook,实现函数式组件状态的复用</h1>
      </div>
      <div style={{ fontSize: 10 }}>
        {position.x}, {position.y}
      </div> */}
    </Switch>
  )
}
