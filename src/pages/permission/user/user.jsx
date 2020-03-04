import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import UserHome from './user-home'
import UserAddUpdate from './user-add-update'

function User() {
  return (
    <div>
      <Switch>
        <Route path="/permission/user/single" component={UserHome} exact />
        <Route path="/permission/user/single/addupdate" component={UserAddUpdate} />
        <Redirect to="/permission/user/single" />
      </Switch>
    </div>
  )
}

export default User
