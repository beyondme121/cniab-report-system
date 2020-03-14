## 根据用户的权限, 显示菜单

- 根据登录用户,查询用户信息(角色和菜单数组)
- 便利菜单,对每个菜单进行权限校验,如果 menuList 中的菜单存在于用户的菜单列表中,就显示
- 登录用户信息存储在 redux 中,在 login 组件触发 action 进行设置

### 默认打开用户所具有的菜单权限的所有父级菜单

- Menu 菜单中,Item 的 key 采用 MenuPath 来标识唯一性
- 给 isAuth 函数传递 user 对象的考虑点是,不用每次在函数中获取
- 实现默认选中: 如果用户在 url 中输入了 SPA 的 url 路径, 默认选中就是路由的 pathname, 要处理 query 查询携带?的情况,去掉?以后的保留之前的
- 实现默认打开所有子集菜单:
  - 遍历 children 结构的对象数组,如果有 children,说明可能就需要打开.
  - 如果 children 中有用户的菜单项, 就把还有 children 的 item 的 MenuPath 存放在一个数组中, 这个数组就是默认打开的 key 的数组

```js
getMenuNodes = data => {
  const user = this.refUser.user;
  // 菜单选项不显示根菜单
  return data.map(menu => {
    if (this.isAuth(menu, user)) {
      if (!menu.children) {
        return (
          <Item key={menu.MenuPath}>
            <Link to={menu.MenuPath}>
              <MyIcon type={menu.MenuIcon} />
              <span>{menu.MenuNameCN}</span>
            </Link>
          </Item>
        );
      } else {
        // 如果children中有用户可访问的菜单, user的被授权的菜单包含在当前子集children中,取出这个children的这个元素
        const cItem = menu.children.find(
          cItem => user.menu_paths.indexOf(cItem.MenuPath) !== -1
        );
        // 可能能找到,也可能找不到
        if (cItem) {
          this.openKeys.push(menu.MenuPath);
        }
        return (
          <SubMenu
            key={menu.MenuPath}
            title={
              <span>
                <MyIcon type={menu.MenuIcon} />
                <span>{menu.MenuNameCN}</span>
              </span>
            }
          >
            {this.getMenuNodes(menu.children)}
          </SubMenu>
        );
      }
    }
  });
};
```

### 想做一个用户随便输入一个 url,没有权限或者地址错误, 都跳转到用户所拥有权限菜单的第一个菜单

- 实现方式是,通过 redux 中 user 的 menu 菜单,返回 menu[0]的菜单 menu_path

### 根据用户组的角色获取用户的菜单, 合并 用户角色所具有的菜单

- 在 admin 应用的业务主入口处,判断 url 是否进行重定向

```js
// 同时满足以下3个条件的, 都要重定向到有权访问的第一个默认路由。
// 0. 如果是admin用户不受限制
// 1. 如果用户有可访问的已经授权的菜单列表
// 2. url路径不在访问的列表中
// 3. 登录之后跳转到首页url不是根路径/, 才进行判断. 如果是根路径,走路由Switch, 如果没有匹配,就重定向到dashboard/order
// 3. 输入的路径菜单类型不是public

if (this.props.user.user.user_name !== "admin") {
  let findItem = this.props.menu.find(
    item => item.MenuPath === this.props.location.pathname
  );
  if (
    menu_paths.length > 0 && // 存在已经授权的菜单列表
    menu_paths.indexOf(this.props.location.pathname) === -1 && // url路径不在访问的列表中
    this.props.location.pathname !== "/" && // 登录之后跳转到首页url -> /
    findItem &&
    findItem.auth_type !== "public" // 访问的url路径不是公开的public
  ) {
    return <Redirect to={menu_paths[0]} />;
  }
}
```

### 一个用户的权限问题

- 用户被授予角色的菜单列表
- 用户所属组的权限(用户组的菜单权限)
- 以上两者的并集就是该登录用户的所有可访问的菜单
