import React, { PureComponent } from 'react';
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { getMenuList } from '../../redux/actions/menu-actions'
import { MyIcon } from '../../components/my-icon'
import { Component } from 'react';
const { SubMenu, Item } = Menu

@connect(
  state => ({
    menuList: state.menu,
    user: state.user
  }),
  { getMenuList }
)
@withRouter
class LeftNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuLists: []
    }
    this.refUser = this.props.user
    this.openKeys = []
  }

  // 1. 整理数据 -> 数据库中的二维表转换成层级结构
  makeDataToChildren = (source) => {
    let cloneData = (JSON.parse(JSON.stringify(source))).filter(item => item.ParentMenuId !== '0000')
    let leafMenu = []
    const result = cloneData.filter(father => {
      let children = []
      for (let i = 0; i < cloneData.length; i++) {
        if (father.MenuId === cloneData[i].ParentMenuId) {
          children.push(cloneData[i])
          // 数组去重
          if (leafMenu.indexOf(cloneData[i].MenuId) === -1) {
            leafMenu.push(cloneData[i].MenuId)
          }
        }
      }
      if (children.length > 0) {
        father.children = children
      }
      return leafMenu.indexOf(father.MenuId) === -1
    })
    return result
  }

  // 判断当前用户是否有权限
  /**
   * 1. menu_item: 查询的每个菜单对象,如果有子集,就有children属性,没有子集,就没有children
   * 2. user: 当前用户的基本信息 + 授权信息(角色+菜单数组)
   */
  isAuth = (menu_item, user) => {
    const { type, auth_type, MenuPath, MenuId } = menu_item
    if (type === 'menu') {
      if (user.user_name === 'admin' || auth_type === 'public' || user.menu_ids.indexOf(MenuId) !== -1) {
        return true
      } else if (menu_item.children) {
        return !!menu_item.children.find(child => user.menu_ids.indexOf(child.MenuId) !== -1)
      }
    }
  }

  // 接收整理后为带有children的数据,生成标签组件
  /* getMenuNodes = (data) => {
    const user = this.refUser.user
    // 菜单选项不显示根菜单
    return data.map(menu => {
      if (this.isAuth(menu, user)) {
        if (!menu.children) {
          return (
            <Item key={menu.MenuId}>
              <Link to={menu.MenuPath}>
                <MyIcon type={menu.MenuIcon} />
                <span>{menu.MenuNameCN}</span>
              </Link>
            </Item>
          )
        } else {
          // 如果children中有用户可访问的菜单, user的被授权的菜单包含在当前子集children中,取出这个children的这个元素
          const cItem = menu.children.find(cItem => user.menu_ids.indexOf(cItem.MenuId) !== -1)
          // 可能能找到,也可能找不到
          if (cItem) {
            this.openKeys = menu.MenuId
          }
          return (
            <SubMenu
              key={menu.MenuId}
              title={
                <span>
                  <MyIcon type={menu.MenuIcon} />
                  <span>{menu.MenuNameCN}</span>
                </span>
              }
            >
              {this.getMenuNodes(menu.children)}
            </SubMenu>
          )
        }
      }
    })
  } */

  getMenuNodes = (data) => {
    const user = this.refUser.user
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
          )
        } else {
          // 如果children中有用户可访问的菜单, user的被授权的菜单包含在当前子集children中,取出这个children的这个元素
          const cItem = menu.children.find(cItem => user.menu_paths.indexOf(cItem.MenuPath) !== -1)
          // 可能能找到,也可能找不到
          if (cItem) {
            this.openKeys.push(menu.MenuPath)
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
          )
        }
      }
    })
  }

  getDataFromRedux = async () => {
    await this.props.getMenuList()
    const { menuList } = this.props
    let data = this.makeDataToChildren(menuList)
    let menuLists = this.getMenuNodes(data)
    this.setState({
      menuLists
    })
  }

  componentDidMount() {
    // 加载菜单
    this.getDataFromRedux()
  }


  render() {
    const pathname = this.props.history.location.pathname
    const { menuLists } = this.state
    const openKeys = this.openKeys
    return (
      <Menu
        selectedKeys={[pathname]}
        defaultOpenKeys={openKeys}
        mode="inline"
        theme="light"
      >
        {
          menuLists
        }
      </Menu>
    )
  }
}

export default LeftNav