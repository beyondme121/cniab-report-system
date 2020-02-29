import React from "react";
import { Menu, Icon } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import menuConfig from '../../config/menuConfig'

const { SubMenu, Item } = Menu

function LeftNav(props) {

  // let pathname = props.location.pathname
  let { pathname } = useLocation()
  let defaultOpenKeys = []

  const getMenuNodes = (menuList) => {
    return menuList.map(menu => {
      if (!menu.children) {
        return (
          <Item key={menu.key}>
            <Link to={menu.key}>
              <Icon type={menu.icon} />
              <span>{menu.title}</span>
            </Link>
          </Item>
        )
      } else {
        if (menu.children.find(cItem => pathname.indexOf(cItem.key) === 0)) {
          defaultOpenKeys.push(menu.key)
        }

        return (
          <SubMenu
            key={menu.key}
            title={
              <span>
                <Icon type={menu.icon} />
                <span>{menu.title}</span>
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
        getMenuNodes(menuConfig)
      }
    </Menu>
  )
}

export default LeftNav