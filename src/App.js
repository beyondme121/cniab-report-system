import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { Redirect } from 'react-router-dom'

import Login from './pages/login'
import Admin from './pages/admin'
// import NotFound from './components/not-found'
// import Example from './test/test-lifecycle'
// import TableTest from './test/test-table-search'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        {/* <Route path="/notfound" component={NotFound} /> */}
        <Route path="/" component={Admin} />
      </Switch>
    </Router>
  )
}
export default App