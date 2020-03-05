import React, { Component } from 'react'
import { Card, Form, Input, Button, Icon, Row, Col, message } from 'antd'
import { reqAddUser, reqUserList } from '../../../../api'
const { Item } = Form

@Form.create()
class UserAddUpdate extends Component {

  state = {
    users: []
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const result = await reqAddUser(values)
        console.log("result: ", result)
        if (result.status === 0) {
          message.success(result.msg)
          // this.props.history.push('/permission/user/single')
          this.props.history.goBack()
          await reqUserList()
        }
      }
    })
  }

  componentDidMount() {

  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 8 }, // 右侧包裹的宽度
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
        <Form onSubmit={this.handleSubmit} {...formItemLayout}>
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
          <Item label="AD账号">
            {
              getFieldDecorator('ad_account', {
                initialValue: ''
              })(
                <Input placeholder="填写AD账号" />
              )
            }
          </Item>
          <Item label="电话">
            {
              getFieldDecorator('phone_no', {
                initialValue: '',
                // rules: [
                //   { required: true, message: '必须填写用户名' }
                // ]
              })(
                <Input placeholder="填写电话" />
              )
            }
          </Item>
          <Row>
            <Col span={4} offset={6}>
              <Item>
                <Button>取消</Button>
              </Item>
            </Col>
            <Col span={4} pull={2}>
              <Item>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Item>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }
}
export default UserAddUpdate