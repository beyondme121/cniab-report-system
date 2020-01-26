# 项目开发记录

## 1. 初始化项目环境配置

- 1.1 引入 antd

`yarn add react-app-rewired customize-cra babel-plugin-import`

- 1.2 配置config-overrides.js

```js
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' },
  }),
);
```

- 1.3 修改package.json 的scripts

```js
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
},
```

- 1.4 安装 less 和 less-loader自动就可以使用了,基于1.2的配置
- 1.5 配置react-redux

```js
// index.js
import { Provider } from 'react-redux'
import store from './redux/store'
ReactDOM.render(<Provider store={store}>
  <App />
</Provider>, document.getElementById('root'));
```

> store.js

```js
import { createStore, applyMiddleware } from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import combineReducers from './reducers'

export default createStore(combineReducers, composeWithDevTools(applyMiddleware(thunk)))
```

> reducers.js

```js
import { combineReducers } from 'redux'
import { INCREMENT } from './action-types'

const initCount = 0
function counter(state = initCount, action) {
  switch (action.type) {
    case INCREMENT:
      return state + action.payload
    default:
      return state
  }
}


const initUser = {
  name: 'sanfeng'
}
function user(state = initUser, action) {
  return state
}

export default combineReducers({
  counter,
  user
})

```

> actions.js

```js
import { INCREMENT } from './action-types'

export const increment = num => ({
  type: INCREMENT,
  payload: num
})
```

> action-types.js

```js
export const INCREMENT = 'increment'
```

> App.js中connect store中的数据

```js
import { connect } from 'react-redux'
import { increment } from './redux/actions'

const mapStateToProps = state => ({
  counter: state.counter,
  user: state.user
})

const mapDispatchToProps = {
  increment
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

// 元素上绑定事件 触发action
<Button type="primary" onClick={() => handleAdd(5)}>加5</Button>
// 
function handleAdd(num) {
  props.increment(num)
}
```



- 1.6 配置react-router-dom

配置好router之后就是路由设计, 在根组件中App.js中设计路由

```js
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
```



## 2. 避坑

### 1. 使用antd布局让页面高度100%

> 在reset.css

```js
/* 让页面的整体高度100%, html,body,#root缺一不可 */
html,
body,
#root {
  width: 100%;
  height: 100%;
}

```

