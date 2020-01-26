import React from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu } from 'antd'

import logo from '../../assets/images/ABB_Logo.png'
import './index.less'

const { Header } = Layout

export default function MyHeader() {
  return (
    <Header>
      <div className="header-left">
        <Link to="/" className="header-left-logo">
          <img src={logo} alt="ABB-Logo" />
          {/* <h1><strong>CNIAB Report</strong></h1> */}
        </Link>
      </div>
      <div className="header-middle">
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '50px' }}
        >
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </div>
      <div className="header-right">
        <Menu
          theme="light"
          mode="horizontal"
          // defaultSelectedKeys={['1']}
          style={{ lineHeight: '50px' }}
        >
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </div>

    </Header>
  )
}
