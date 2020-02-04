import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, Menu } from 'antd'

import logo from '../../assets/images/ABB_Logo.png'
import './index.less'
import menuConfig from '../../config/menuConfig'

import LinkButton from '../link-button'

// action
import { logout } from '../../redux/actions'


const { Header } = Layout
const { Item } = Menu

function HeaderNav(menuList) {
  const { pathname } = useLocation()
  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{ lineHeight: '50px' }}
      selectedKeys={[pathname]}
    >
      {
        menuList.map(menu => {
          return (
            <Item key={menu.key}>
              <span>
                <Link to={menu.key} >
                  {menu.title}
                </Link>
              </span>
            </Item>
          )
        })
      }
    </Menu>
  )
}

function MyHeader(props) {

  const handleLogout = () => {
    props.logout()
  }

  return (
    <Header>
      <div className="header-left">
        <Link to="/" className="header-left-logo">
          <img src={logo} alt="ABB-Logo" />
          {/* <h1><strong>CNIAB Report</strong></h1> */}
        </Link>
      </div>
      <div className="header-middle">
        {HeaderNav(menuConfig)}
      </div>
      <div className="header-right">
        <div className="login-user">
          张三
        </div>
        <LinkButton onClick={handleLogout}>
          注销
        </LinkButton>
      </div>

    </Header>
  )
}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(MyHeader)
