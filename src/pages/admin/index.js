import React from 'react'
import { connect } from 'react-redux'
import { Layout, message } from 'antd'
import { Switch, Route, Redirect } from 'react-router-dom'
// 公共组件
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
// actions
import { getMenuList } from "../../redux/actions/menu-actions";

// 路由组件
import DashboardHome from '../dashboard/home'
// import Product from '../products/product'
// import Region from '../region/region'
import Sales from '../sales'
import RequestCategory from '../category/category'
import Role from '../permission/role/role'
import Menu from '../permission/menu/menu'
import User from '../permission/user'


const { Sider, Content, Footer } = Layout

@connect(
  state => ({ user: state.user, menu: state.menu }),
  { getMenuList }
)
class Admin extends React.Component {
  state = {
    menuList: []
  }

  /* isAuth = (menu_item, user) => {
    const { type, auth_type, MenuPath, MenuId } = menu_item
    if (type === 'menu') {
      if (user.user_name === 'admin' || auth_type === 'public' || user.menu_ids.indexOf(MenuId) !== -1) {
        return true
      } else if (menu_item.children) {
        return !!menu_item.children.find(child => user.menu_ids.indexOf(child.MenuId) !== -1)
      }
    }
  } */

  // 引用left-nav中的函数
  /* makeDataToChildren = (source) => {
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

  getAllAllowMenusMap = (data) => {
    return data.map(menu => {
      if (!menu.children) {
        if (menu.MenuPath === this.props.location.pathname) {
          // return menu.MenuPath
          return menu.MenuPath
        }
      } else {
        // 如果有子节点, 查找每一个子节点, 如果子节点的路径和url一致,就返回
        const cItem = menu.children.find(cItem => cItem.MenuPath === this.props.location.pathname)
        if (cItem) {
          return menu.MenuPath
        }
        this.getAllAllowMenusMap(menu.children)
      }
    })
  }

  getAllAllowMenus = data => {
    const menu_paths = this.props.user.user.menu_paths
    return data.reduce((pre, menu) => {
      if (!menu.children) {
        if (menu.MenuPath === this.props.location.pathname) {
          pre.push(menu.MenuPath)
        }
      } else {
        const cItem = menu.children.find(cItem => cItem.MenuPath === this.props.history.location.pathname)
        if (cItem) {
          pre.push(menu.MenuPath)
        }
        this.getAllAllowMenus(menu.children)
      }
      return pre
    }, [])
  } */



  getMenuList = async () => {
    await this.props.getMenuList()
    /* console.log(this.props.menu)
    let data = this.makeDataToChildren(this.props.menu)
    console.log("data: ", data)
    let allowMenus = this.getAllAllowMenus(data)
    console.log("allowMenus", allowMenus)
    this.setState({
      menuList: allowMenus
    }) */
  }

  componentDidMount() {
    this.getMenuList()
  }

  // 判断pathname如果不在user的menu中,就是无权访问的路由
  render() {
    const { menu_paths } = this.props.user.user
    // 如果用户未登录, 跳转为登录页
    if (!this.props.user.isLogin) {
      return <Redirect to='/login' />
    }
    // 同时满足以下3个条件的, 都要重定向到有权访问的第一个默认路由。
    // 0. 如果是admin用户不受限制
    // 1. 如果用户有可访问的已经授权的菜单列表
    // 2. url路径不在访问的列表中
    // 3. 登录之后跳转到首页url不是根路径/, 才进行判断. 如果是根路径,走路由Switch, 如果没有匹配,就重定向到dashboard/order
    // 3. 输入的路径菜单类型不是public

    if (this.props.user.user.user_name !== 'admin') {
      let findItem = this.props.menu.find(item => item.MenuPath === this.props.location.pathname)
      if (
        menu_paths.length > 0 &&                                                // 存在已经授权的菜单列表
        menu_paths.indexOf(this.props.location.pathname) === -1 &&              // url路径不在访问的列表中
        this.props.location.pathname !== '/' &&                                 // 登录之后跳转到首页url -> /
        (findItem && findItem.auth_type !== 'public')                           // 访问的url路径不是公开的public
      ) {
        return <Redirect to={menu_paths[0]} />
      }
    }

    // if ( menu_paths.indexOf(this.props.location.pathname) === -1 && )
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
                <Route path="/dashboard" component={DashboardHome} />
                <Route path="/sales" component={Sales} />
                {/* <Route path="/sales/product" component={Product} />
                <Route path="/sales/region" component={Region} /> */}
                <Route path="/request/category" component={RequestCategory} />
                <Route path="/permission/role" component={Role} />
                <Route path="/permission/menu" component={Menu} />
                <Route path="/permission/user" component={User} />
                <Redirect to="/dashboard/order" />
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