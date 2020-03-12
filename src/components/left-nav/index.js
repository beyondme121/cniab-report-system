import React, { PureComponent } from 'react';
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { getMenuList } from '../../redux/actions/menu-actions'
import { reqMenuList } from '../../api'
import { MyIcon } from '../../components/my-icon'
import setTreeMenuFilter from "../../utils/setTreeMenuFilter";
const { SubMenu, Item } = Menu

@connect(
  state => ({ menuList: state.menu }),
  { getMenuList }
)
@withRouter
class LeftNav extends PureComponent {
  state = {
    menuLists: []
  }
  // findIndexByKeyValue = (arr, key, valuetosearch) => {
  //   for (var i = 0; i < arr.length; i++) {
  //     if (arr[i][key] == valuetosearch) {
  //       return i;
  //     }
  //   }
  //   return -1;
  // }

  makeDataToChildren = (source) => {
    let cloneData = (JSON.parse(JSON.stringify(source))).filter(item => item.ParentMenuId !== '0000')
    let leafMenu = []
    const result = cloneData.filter(father => {
      // let children = cloneData.filter(child => father.MenuId === child.ParentMenuId);
      let children = []
      for (let i = 0; i < cloneData.length; i++) {
        if (father.MenuId === cloneData[i].ParentMenuId) {
          children.push(cloneData[i])
          if (leafMenu.indexOf(cloneData[i].MenuId) === -1) {
            leafMenu.push(cloneData[i].MenuId)
          }
        }
      }
      if (children.length > 0) {
        father.children = children
      }
      return leafMenu.indexOf(father.MenuId) === -1
      // return this.findIndexByKeyValue(branchArr, 'ParentMenuId', father.MenuId) !== -1
    })
    return result
  }

  // 1. 整理数据 -> 数据库中的二维表转换成层级结构
  getMenuNodes = (data) => {
    // const innerMenuList = this.makeDataToChildren(data)
    // 菜单选项不显示根菜单
    return data.map(menu => {
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

    })
  }

  getMenuNodesByAPI = async () => {
    const { status, data: menuList } = await reqMenuList()
    if (status === 0) {
      let data = this.makeDataToChildren(menuList)
      let menuLists = this.getMenuNodes(data)
      this.setState({
        menuLists
      })
    }
  }

  componentDidMount() {
    // 加载菜单
    this.getMenuNodesByAPI()
  }

  render() {
    const { pathname } = this.props.history.location.pathname
    const { menuLists } = this.state
    return (
      <Menu
        selectedKeys={[pathname]}
        // defaultOpenKeys={defaultOpenKeys}
        mode="inline"
        theme="light"
      >
        {
          // this.getMenuNodes(menuLists)    // 2.
          menuLists
        }
      </Menu>
    )
  }
}

export default LeftNav