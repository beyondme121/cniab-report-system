### 1. dayjs 获取时间存入数据库,取出时间字段时间多了 8 小时

<!-- TODO -->

### 2. 修改用户

<!-- DONE -->

- 如果某个用户 id 还没有授予角色或者角色还没有菜单,inner join 会查不出用户

> 错误写法

```js
SELECT a.user_id,a.user_name,a.password, a.email,a.ad_account,a.phone_no,
      a.createtime,a.first_login_time,a.last_login_time, a.login_count,
      b.role_id,c.RoleName
FROM dbo.Users a
INNER JOIN dbo.UsersRoles b ON b.user_id = a.user_id
INNER JOIN dbo.Role c ON b.role_id=c.RoleId
WHERE a.status = 1
AND b.status = 1
AND c.status = 1
AND a.user_id='${user_id}'
```

> 正确写法

```js
SELECT a.user_id,a.user_name,a.password, a.email,a.ad_account,a.phone_no,
      a.createtime,a.first_login_time,a.last_login_time, a.login_count,
      b.role_id,c.RoleName
FROM dbo.Users a
LEFT JOIN dbo.UsersRoles b ON b.user_id = a.user_id AND b.status=1
LEFT JOIN dbo.Role c ON b.role_id=c.RoleId AND c.status=1
WHERE a.status = 1
  AND a.user_id='${user_id}'
```

### 菜单设置排序字段,sql 中排序后,sortkey 小的会不按照菜单层级显示

<!-- TODO -->

### 用户授权角色

<!-- TODO -->

- 设置用户某个或某些角色, 点击 OK 之后, 设置成功, 然后再次点击授权角色, 弹出的 modal 没有已经选择的角色信息
- 只有重新点击一下别的用户,再点击回来这个用户,才能显示角色

1. 使用 didUpdate 中判断前后 props 的 user_id 是否发生了变化,如果没有变化,就不重新请求用户的角色数据
2. 以上就会造成更改了用户的角色信息,再次点击没有更新的情况

**解决办法**

1. 使用 willReceiveProps, 只要接收到参数就请求
2. 或者再更新信息后,强制将选择的用户设置为空对象
3. 给角色添加菜单为例, 请求成功后, 将 state.role 设置为空对象, Table 中的默认选中按钮就清空,迫使用户再次点击角色进行设置

```js
// 3. 给角色授权, 添加角色的菜单
updateRoleMenus = async () => {
  const { RoleId } = this.state.role; // 点击某一行时触发onRow回调设置的状态数据role
  let menus = this.auth.current.getMenus(); // 调用子组件授权菜单组件的方法,收集选中的菜单ids
  // 请求更新角色的菜单
  const { status, msg } = await reqAuthRoleMenu({ RoleId, menus });
  if (status === 0) {
    message.success(msg);
    this.setState({
      isShowAuth: false,
      role: {} // 更新用户授权后, 强制把当前选中的role清空,迫使用户再次点击角色进行设置
    });
    this.getRoles();
  }
};
```
