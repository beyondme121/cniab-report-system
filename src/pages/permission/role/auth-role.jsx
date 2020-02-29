import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tree } from 'antd'

const { Item } = Form
const { TreeNode } = Tree

export default class AuthRole extends Component {
  static propTypes = {
    role: PropTypes.object
  }
  render() {
    const { role } = this.props
    const formItemLayout = {
      labelCol: { span: 6 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }
    return (
      <Form {...formItemLayout}>
        <Item label="角色名称" >
          <Input value={role.RoleName} disabled />
        </Item>
        <Tree
          checkable
          defaultExpandedKeys={['0-0-0', '0-0-1']}
          defaultSelectedKeys={['0-0-0', '0-0-1']}
          defaultCheckedKeys={['0-0-0', '0-0-1']}
        >
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="parent 1-0" key="0-0-0" disabled>
              <TreeNode title="leaf" key="0-0-0-0" disableCheckbox />
              <TreeNode title="leaf" key="0-0-0-1" />
            </TreeNode>
            <TreeNode title="parent 1-1" key="0-0-1">
              <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
            </TreeNode>
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}
