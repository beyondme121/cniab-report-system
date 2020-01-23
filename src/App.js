import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import ReduxTest from './test/test-redux'
import Login from './test/test-router-login'
import Main from './test/test-router-main'


function App() {
  return (
    <Router>
      <Switch>
        <Redirect from='/' to='/main' exact />
        <Route path='/login' component={Login} />
        <Route path='/main' component={Main} />
        <Route path='/redux' component={ReduxTest} />
      </Switch>
    </Router>
  )
}


export default App