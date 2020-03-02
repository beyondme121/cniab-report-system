import React, { Component } from 'react'

import {
  Form, Input, Select
} from 'antd'

import { reqRoleList } from '../../../api'

const { Item } = Form
const { Option } = Select

class AddRole extends Component {
  state = {
    roles: []
  }

  onFocus = () => {
    this.getRoles()
  }

  getRoles = async () => {
    const result = await reqRoleList()
    if (result.status === 0) {
      this.setState({
        roles: result.data
      })
    }
  }

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form)
  }

  componentDidMount() {
    this.getRoles()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }
    return (
      <Form {...formItemLayout}>
        <Item label="角色名称" >
          {
            getFieldDecorator('RoleName', {
              initialValue: '',
              rules: [
                { required: true, message: '角色名称必须输入' }
              ]
            })(
              <Input placeholder="请输入角色名称" />
            )
          }
        </Item>
        <Item label="角色描述" >
          {
            getFieldDecorator('RoleDesc', {
              initialValue: '',
            })(
              <Input placeholder="请输入角色描述" />
            )
          }
        </Item>
        <Item label="父级角色名称" >
          {
            getFieldDecorator('ParentRoleId')(
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="选择父级角色"
                optionFilterProp="children"
                onFocus={this.onFocus}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  this.state.roles.map(role => (
                    <Option key={role.RoleId} value={role.RoleId}>{role.RoleName}</Option>
                  ))
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddRole)