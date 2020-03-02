import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tree } from 'antd'
import { connect } from 'react-redux'
import { getMenuList } from '../../../redux/actions/menu-actions'
// import setTreeData from '../../../utils/setTreeMenu'
import setTreeMenuFilter from "../../../utils/setTreeMenuFilter";

const { Item } = Form
const { TreeNode } = Tree

@connect(
  state => ({
    menuList: state.menu
  }),
  { getMenuList }
)
class AuthRole extends Component {

  static propTypes = {
    role: PropTypes.object,
    getMenus: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    const { menus } = this.props.role
    this.state = {
      checkedKeys: menus || [],      // 角色的默认菜单列表从角色接口中获取,通过props传递给角色授权组件
    }
  }

  //将父子结构的数据 转换为 树状结构的数据

  /* getTreeNodes = (menuList) => {
    let treeData = setTreeData(menuList, {
      id: 'MenuId',
      parentId: 'ParentMenuId',
      name: 'MenuNameCN',
      rootId: '0000'
    })
    this.menuList = this.makeTreeNode(treeData)
  } */

  // // 根据整理后的菜单json数据, 带有children属性的数据 生成

  /* makeTreeNode = (menuList) => {
    let data = menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.id}>
          {item.children.length > 0 ? this.makeTreeNode(item.children) : null}
        </TreeNode>
      )
      return pre
    }, [])
    return data
  } */

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
  onCheck = (checkedKeys, info) => {
    // console.log('onCheck', checkedKeys, info);
    // 将收集的选中菜单传递给父组件
    this.props.getMenus(checkedKeys)
    this.setState({
      checkedKeys
    })
  }

  // 返回选择的菜单项
  getMenus = () => {
    return this.state.checkedKeys
  }

  componentDidMount() {
    // 调用异步action 请求菜单menu数据
    this.props.getMenuList()
    // 从redux中获取menu数据, 父子结构数据, 转换树状结构数据 并生成 TreeNode
    this.getTreeNodes(this.props.menuList)
  }

  render() {
    const { role } = this.props
    const { checkedKeys } = this.state
    console.log("role:", this.props.role)
    const formItemLayout = {
      labelCol: { span: 6 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }
    if (this.props.menuList) this.getTreeNodes(this.props.menuList)
    return (
      <Form {...formItemLayout}>
        <Item label="角色名称" >
          <Input value={role.RoleName} disabled />
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          onCheck={this.onCheck}
        >
          {this.menuList}
        </Tree>
      </Form>
    )
  }
}

export default AuthRole
// export default connect(
//   state => ({ menuList: state.menu }),
//   { getMenuList }
// )(AuthRole)