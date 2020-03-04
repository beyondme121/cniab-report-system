import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import User from './userinfo/user'
import Group from './groupinfo/group'


export default class UserIndex extends Component {
  render() {
    return (
      <div>
        {/* <div>用户管理模块</div> */}
        <Switch>
          <Route path="/permission/user/single" component={User} />
          <Route path="/permission/user/group" component={Group} />
        </Switch>
      </div>

    )
  }
}
