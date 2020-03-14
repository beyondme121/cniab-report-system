import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Product from './products/product'
import Region from './region/region'

export default function Sales() {

  return (
    <Switch>
      <Route path="/sales/product" component={Product} />
      <Route path="/sales/region" component={Region} />
      <Redirect to="/sales/product" />
    </Switch>
  )
}
