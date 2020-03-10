import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import UserHome from './user-home'
import AddUpdateUser from './add-update-user'

function User() {
  return (
    <div>
      <Switch>
        <Route path="/permission/user/single" component={UserHome} exact />
        <Route path="/permission/user/single/addupdate" component={AddUpdateUser} />
        <Redirect to="/permission/user/single" />
      </Switch>
    </div>
  )
}

export default User
