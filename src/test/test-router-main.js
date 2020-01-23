import React from 'react'
import { Switch, Route, Redirect, Link } from 'react-router-dom'

import NotFound from './not-found'
import Product from './product'
import ProductDetail from './product-detail'

export default function RouterMain() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to='/main/product'>Product</Link>
          </li>
          <li>
            <Link to='/main/region'>Region</Link>
          </li>
        </ul>
      </nav>
      <div>
        <Switch>
          <Redirect from='/main' to='/main/product' exact />
          <Route path='/main/product' exact render={() => {
            return <Product />
          }} />
          <Route path='/main/product/detail/:id' component={ProductDetail} />
          <Route path='/main/region' render={() => {
            return <div>Region</div>
          }} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  )
}
