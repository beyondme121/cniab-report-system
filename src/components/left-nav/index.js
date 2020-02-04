import React from "react";
import { Menu, Icon } from 'antd'
import { withRouter, Link, useLocation } from 'react-router-dom'
import menuConfig from '../../config/menuConfig'

const { SubMenu, Item } = Menu

function LeftNav(props) {

  // let pathname = props.location.pathname
  const { pathname } = useLocation()
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

export default withRouter(LeftNav)