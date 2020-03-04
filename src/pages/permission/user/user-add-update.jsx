import React, { Component } from 'react'
import { Card, Form, Input, Button, Icon } from 'antd'
// import { } from '../../../api'
const { Item } = Form

@Form.create()
class UserAddUpdate extends Component {

  state = {
    users: []
  }

  componentDidMount() {

  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }
    const title = (
      <div>
        <Button type="link" onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" />
          <span>添加用户</span>
        </Button>
      </div>
    )
    return (
      <Card title={title}>
        <Form {...formItemLayout} type="submit">
          <Item label="用户名">
            {
              getFieldDecorator('user_name', {
                initialValue: '',
                rules: [
                  { required: true, message: '必须填写用户名' }
                ]
              })(
                <Input placeholder="填写用户名" />
              )
            }
          </Item>
          <Item label="密码">
            {
              getFieldDecorator('password', {
                initialValue: '',
                rules: [
                  { required: true, message: '必须填写密码' }
                ]
              })(
                <Input placeholder="填写密码" />
              )
            }
          </Item>
          <Item label="邮箱">
            {
              getFieldDecorator('email', {
                initialValue: '',
                rules: [
                  { required: true, message: '必须填写用户名' }
                ]
              })(
                <Input placeholder="填写用户名" />
              )
            }
          </Item>
        </Form>
      </Card>
    )
  }
}
export default UserAddUpdate