# 项目开发记录

## 1. 初始化项目环境配置

- 1.1 引入 antd

`yarn add react-app-rewired customize-cra babel-plugin-import`

- 1.2 配置 config-overrides.js

```js
const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { "@primary-color": "#1DA57A" }
  })
);
```

- 1.3 修改 package.json 的 scripts

```js
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
},
```

- 1.4 安装 less 和 less-loader 自动就可以使用了,基于 1.2 的配置
- 1.5 配置 react-redux

```js
// index.js
import { Provider } from "react-redux";
import store from "./redux/store";
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

> store.js

```js
import { createStore, applyMiddleware } from "redux";

import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import combineReducers from "./reducers";

export default createStore(
  combineReducers,
  composeWithDevTools(applyMiddleware(thunk))
);
```

> reducers.js

```js
import { combineReducers } from "redux";
import { INCREMENT } from "./action-types";

const initCount = 0;
function counter(state = initCount, action) {
  switch (action.type) {
    case INCREMENT:
      return state + action.payload;
    default:
      return state;
  }
}

const initUser = {
  name: "sanfeng"
};
function user(state = initUser, action) {
  return state;
}

export default combineReducers({
  counter,
  user
});
```

> actions.js

```js
import { INCREMENT } from "./action-types";

export const increment = num => ({
  type: INCREMENT,
  payload: num
});
```

> action-types.js

```js
export const INCREMENT = "increment";
```

> App.js 中 connect store 中的数据

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

- 1.6 配置 react-router-dom

配置好 router 之后就是路由设计, 在根组件中 App.js 中设计路由

```js
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import ReduxTest from "./test/test-redux";
import Login from "./test/test-router-login";
import Main from "./test/test-router-main";

function App() {
  return (
    <Router>
      <Switch>
        <Redirect from="/" to="/main" exact />
        <Route path="/login" component={Login} />
        <Route path="/main" component={Main} />
        <Route path="/redux" component={ReduxTest} />
      </Switch>
    </Router>
  );
}
export default App;
```

## 2. 避坑

### 1. 使用 antd 布局让页面高度 100%

> 在 reset.css

```js
/* 让页面的整体高度100%, html,body,#root缺一不可 */
html,
body,
#root {
  width: 100%;
  height: 100%;
}

```

## 3. 商品管理模块

### 1. 添加商品

点击添加按钮，路由跳转到一个新的界面(注意区分和新增类别不一样, 新增类别是弹出一个模态框)，为什么是路由一个新的界面，**因为需要添加的商品内容较多，modal 放不下那么多内容**

### 2. 商品管理的路由设计

在 content 区域首先包含了展示所有商品内容列表，列表中包含了“详情”，“修改商品”，以及“新增商品”，这些内容，都要在 content 区域进行展示，涉及到子路由的概念。

商品管理功能中，有几个界面？界面之间有没有公用内容？怎么形成组件？组件的路由如何设计?

1. 商品的主界面 home

商品管理的首页 /product

添加和吸怪商品 /product/addupdate

详情 /product/detail

### 3. 静态页面

### 4. 商品列表的后台分页

接口请求函数 api/index.js

client: 需要传递请求的页码(第几页) 以及 一页请求的记录数

server: 需要返回总的记录数 total 以及 请求结果

```js
// 实际请求的url类似: /api/product/listbypage?pageNum=2&pageSize=10
const reqProducts = (pageNum, pageSize) =>
  ajax(BASE + "/product/listbypage", { pageNum, pageSize }, "GET");
```

### 5. 搜索分页

Select 进行按 XXX 查询，同时，可以分页，就是按照查询条件进行分页，点击分页码的查询条件不能丢掉！

流程步骤

1. 定义接口请求函数 api/index.js

```js
export const reqSearchProducts = ({
  pageNum,
  pageSize,
  searchText,
  searchType
}) =>
  ajax(BASE + "/products/search", {
    pageNum,
    pageSize,
    [searchType]: searchText
  });
```

2. 一次性发送多个请求

后端代码返回总数据量以及数据

```js
const ctl_getSearchProductListByPage = async ({
  pageNum,
  pageSize,
  ...rest
}) => {
  let text = "";
  let arr = [];
  Object.keys(rest).forEach(key => {
    arr.push(key + ` like '%${rest[key]}%'`);
  });
  text = arr.join(" and ");

  const results = await Promise.all([
    dao_getSearchProductsByPage(pageNum, pageSize, text),
    dao_getSearchProductTotalCount(text)
  ]);

  if (results[0].rowsAffected > 0 && results[1].rowsAffected > 0) {
    return {
      status: 0,
      data: {
        list: results[0].recordset,
        total: results[1].recordset[0].total
      }
    };
  } else {
    return {
      status: 1,
      data: {
        list: [],
        total: 0
      }
    };
  }
};
```

3. 进入明细页面, 根据产品 ID，查询产品的一级或者二级分类名称

设计状态, 请求接口，修改状态

### 6. 添加商品

1. 路由设计已经在之前写好，在 Home 组件中的“添加商品”按钮中增加路由跳转的事件 props.history.push(url)
2. 静态页面 使用了什么 antd 组 d

### 7. 商品分类的级联菜单

1. 容器组件(AddUpdateProduct)挂载后, 请求分类列表数据`getCategorys(parentId=0)`,获取一级分类
2. 查询的一级分类数据(比如 5 条记录), 进行初始化级联菜单的配置项(Option) `this.initOptions(categorys)`

3. antd 中测 Cascader 组件要配置 options 选项，数组, 由对象组成
4. 显示二级列表

### jwt

> https://www.cnblogs.com/demodashi/p/9582502.html

### 具有大量图片的网站

- 要单独设计一个文件服务器

### 树形菜单

- 参考了两篇文章

1. https://blog.csdn.net/Mr_JavaScript/article/details/82817177 代码少,实现简单
2. https://blog.csdn.net/liangrongliu1991/article/details/78344648 大量使用 for 代码多

- 前提
  1. 菜单必须有一个根几点, 设置根节点的 parent_id 为一个指定的值 如 0000

```js
function toTree(source, { id, parentId, children, rootId }) {
  let cloneData = JSON.parse(JSON.stringify(source));
  return cloneData.filter(father => {
    let branchArr = cloneData.filter(child => father[id] == child[parentId]);
    if (branchArr.length > 0) {
      father[children] = branchArr;
    }
    return father[parentId] == rootId;
  });
}
export default toTree;
```

- 在角色授权, 显示菜单树

```js
getTreeNodes = menuList => {
  let treeData = setTreeMenuFilter(menuList, {
    id: "MenuId",
    parentId: "ParentMenuId",
    children: "children",
    rootId: "0000"
  });
  this.menuList = this.makeTreeNode(treeData);
};

// 根据整理后的菜单json数据, 带有children属性的数据 生成
makeTreeNode = menuList => {
  let data = menuList.reduce((pre, item) => {
    pre.push(
      <TreeNode title={item.MenuNameCN} key={item.MenuId}>
        {item.children ? this.makeTreeNode(item.children) : null}
      </TreeNode>
    );
    return pre;
  }, []);
  return data;
};
```

## 4. 角色授权

- 给角色添加菜单
  - 请求角色列表是, 角色携带菜单的信息数组 menus
  - 选中某个角色,

```
npm view antd versions
```
