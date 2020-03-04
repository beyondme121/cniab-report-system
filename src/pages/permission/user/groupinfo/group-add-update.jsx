import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const { Item } = Form
const { Option } = Select

@connect(
  state => ({
    groupList: state.groupList
  })
)
@Form.create()
class GroupAddOrUpdate extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    group: PropTypes.object
  }

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const { group } = this.props
    const formItemLayout = {
      labelCol: { span: 6 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }
    const { getFieldDecorator } = this.props.form
    return (
      <Form {...formItemLayout}>
        <Item label="用户组名">
          {
            getFieldDecorator("group_name", {
              initialValue: group.group_name,
              rules: [
                { required: true, message: '名称必须填写' }
              ]
            })(
              <Input placeholder="请输入用户组名称" />
            )
          }
        </Item>
        <Item label="用户组描述">
          {
            getFieldDecorator("group_desc", {
              initialValue: group.group_desc,
              rules: [
                { required: true, message: '用户组描述必须填写' }
              ]
            })(
              <Input placeholder="请输入用户组描述" />
            )
          }
        </Item>
        <Item label="父级组名称">
          {
            getFieldDecorator("parent_group_id", {
              initialValue: group.parent_group_id,
            })(
              <Select>
                {
                  this.props.groupList.map(item => (
                    <Option key={item.group_id} value={item.group_id}>{item.group_name}</Option>
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
export default GroupAddOrUpdate
