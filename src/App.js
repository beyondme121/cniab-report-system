import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Login from './pages/login'
import Admin from './pages/admin'
import Example from './test/test-lifecycle'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/test" component={Example} />
        <Route path="/login" component={Login} />
        <Route path="/" component={Admin} />
      </Switch>
    </Router>
  )
}


export default App