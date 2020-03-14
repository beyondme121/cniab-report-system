import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tree } from 'antd'
import { reqMenuList } from '../../../api'

import setTreeMenuFilter from "../../../utils/setTreeMenuFilter";

const { Item } = Form
const { TreeNode } = Tree


class AuthRole extends Component {

  static propTypes = {
    role: PropTypes.object,
  }

  constructor(props) {
    super(props)
    const { menu_ids } = this.props.role
    this.state = {
      menuList: [],
      checkedKeys: [...menu_ids] || []      // 角色的默认菜单列表从角色接口中获取,通过props传递给角色授权组件
    }
  }

  getMenus = () => this.state.checkedKeys

  //将父子结构的数据 转换为 树状结构的数据
  getTreeNodes = (menuList) => {
    let treeData = setTreeMenuFilter(menuList, {
      id: 'MenuId',
      parentId: 'ParentMenuId',
      children: 'children',
      rootId: '0000'
    })
    this.menuList = this.makeTreeNode(treeData)
  }

  // 根据整理后的菜单json数据, 带有children属性的数据 生成
  makeTreeNode = (menuList) => {
    let data = menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.MenuNameCN} key={item.MenuId}>
          {item.children ? this.makeTreeNode(item.children) : null}
        </TreeNode>
      )
      return pre
    }, [])
    return data
  }

  // 选中tree中的某个选项的回调, 将角色的菜单项收集到state
  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys })
  }

  getMenuList = async () => {
    const result = await reqMenuList()
    if (result.status === 0) {
      this.getTreeNodes(result.data)
      this.setState({
        menuList: result.data
      })
    }
  }

  // 接收role对象, 因为role不同, menu也就不同, 但是初始的checkedKeys只执行一次,在constructor中设置的, 所以就会出现设置任何一个role都不再变动
  // 这个生命周期就是 当接收到props发生变化的时候, 触发
  UNSAFE_componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.menu_ids
    this.setState({
      checkedKeys: menus
    })
  }

  componentDidMount() {
    // 调用异步action 请求菜单menu数据
    this.getMenuList()
  }

  render() {
    const { checkedKeys } = this.state
    const { role } = this.props
    const formItemLayout = {
      labelCol: { span: 6 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    if (!this.menuList) return null

    return (
      <div>
        <Tree
          checkable
          defaultExpandAll={true}
          onCheck={this.onCheck}
          checkedKeys={checkedKeys}
        >
          {this.menuList}
        </Tree>
      </div>
    )
  }
}

export default AuthRole