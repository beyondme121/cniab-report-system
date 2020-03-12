import React, { useEffect, useState } from 'react';
import { Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { getMenuList } from '../../redux/actions/menu-actions'
import { MyIcon } from '../../components/my-icon'
import setTreeMenuFilter from "../../utils/setTreeMenuFilter";

const { SubMenu, Item } = Menu

function LeftNav(props) {
  const [menuLists, setMenuLists] = useState(props.menuList)
  useEffect(() => {
    if (props.menuList.length === 0) {
      props.getMenuList()
      console.log("props.menuList: ", props.menuList)
      setMenuLists(props.menuList)
    }
  }, [props.menuList])

  // let pathname = props.location.pathname
  let { pathname } = useLocation()
  let defaultOpenKeys = []
  // -------------------- 生成左侧菜单 --------------------
  // 1. 整理数据 -> 数据库中的二维表转换成层级结构
  const makeMenuListToTree = menuList => {
    let treeData = setTreeMenuFilter(menuList, {
      id: 'MenuId',
      parentId: 'ParentMenuId',
      children: 'children',
      rootId: '0000'
    })
    return treeData
  }

  // 2. 接收DB中二维表, 生成节点
  const getMenuNodes = (data) => {
    const menuList = makeMenuListToTree(data)
    return menuList.map(menu => {
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
        // if (menu.children.find(cItem => pathname.indexOf(cItem.MenuId) === 0)) {
        //   defaultOpenKeys.push(menu.MenuId)
        // }
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
            {getMenuNodes(menu.children)}
          </SubMenu>
        )
      }
    })
  }

  // /sales/product下级路由跳转时, Menu的selectedKeys依然是产品主路由,而不是下级路由,否则默认选中的效果就没有了
  if (pathname.indexOf('/sales/product') === 0) {
    pathname = '/sales/product'
  }
  return (
    <Menu
      selectedKeys={[pathname]}
      defaultOpenKeys={defaultOpenKeys}
      mode="inline"
      theme="light"
    >
      {
        getMenuNodes(menuLists)    // 2.
      }
    </Menu>
  )
}

export default connect(
  state => ({ menuList: state.menu }),
  { getMenuList }
)(LeftNav)