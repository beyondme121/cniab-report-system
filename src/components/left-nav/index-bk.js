import React from 'react'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/ABB_Logo.png'
import './index.less'

const { SubMenu } = Menu;

export default function LeftNav() {
  return (
    <div className='left-nav'>
      <Link to="/" className="left-nav-header">
        <img src={logo} alt="ABB-Logo" />
        <h1><strong>RMS</strong></h1>
      </Link>

    </div>
  )
}
