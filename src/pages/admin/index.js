import React from 'react'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import { Switch, Route, Redirect } from 'react-router-dom'

// 公共组件
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

// 路由组件
import DashboardHome from '../dashboard/home'
import Product from '../products/product'
import Region from '../region/region'
import RequestCategory from '../category/category'
import Role from '../permission/role/role'
import Menu from '../permission/menu/menu'

const { Sider, Content, Footer } = Layout

@connect(
  state => ({ user: state.user }),
  null
)
class Admin extends React.Component {
  render() {
    if (!this.props.user) {
      return <Redirect to='/login' />
    }
    return (
      <Layout style={{ height: '100%' }}>
        <Header />
        <Layout>
          <Sider width={200} style={{ background: '#fff' }} >
            <LeftNav />
          </Sider>
          <Layout>
            <Content style={{ margin: 5, backgroundColor: 'white', width: '100%' }}>
              <Switch>
                <Route path="/dashboard/home" component={DashboardHome} />
                <Route path="/sales/product" component={Product} />
                <Route path="/sales/region" component={Region} />
                <Route path="/request/category" component={RequestCategory} />
                <Route path="/permission/role" component={Role} />
                <Route path="/permission/menu" component={Menu} />
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center', color: '#ccc', fontSize: '10px', padding: '5px 0' }}>
              @2020 Beijing ABB Drive system ltd.
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default Admin