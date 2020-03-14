import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './home'
import AddUpdate from './add-update'
import Details from './details'

// 产品的所有组件统一一个样式
import './product.less'

// 只包含了路由容器功能的组件
export default function Product() {
  return (
    <div>
      <Switch>
        <Route path="/sales/product" component={Home} exact />
        <Route path="/sales/product/addupdate" component={AddUpdate} />
        <Route path="/sales/product/detail" component={Details} />
        <Redirect to="/sales/product" />
      </Switch>
    </div>
  )
}
