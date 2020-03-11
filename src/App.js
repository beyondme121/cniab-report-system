import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Login from './pages/login'
import Admin from './pages/admin'
// import Example from './test/test-lifecycle'
// import TableTest from './test/test-table-search'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Admin} />
      </Switch>
    </Router>
  )
}

// class App extends React.Component {
//   render() {
//     return (
//       <Router>
//         <Switch>
//           <Route path="/login" component={Login} />
//           {/* <Route path="/table" component={TableTest} /> */}
//           <Route path="/" component={Admin} />
//         </Switch>
//       </Router>
//     )
//   }
// }

export default App