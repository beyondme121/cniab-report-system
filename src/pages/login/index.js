import React from 'react'
import { Form, Input, Button, Icon, message } from "antd";
import './index.less'
import logo from '../../assets/images/ABB_Logo.png'
import { connect } from 'react-redux'
import { login } from '../../redux/actions'
import { Redirect } from 'react-router-dom';

const Item = Form.Item


function Login(props) {

  const form = props.form
  const { getFieldDecorator } = form
  const user = props.user

  // 表单提交
  const handleSubmit = (e) => {
    e.preventDefault()
    props.form.validateFields(async (err, values) => {
      if (!err) {
        message.success('登录成功')
        const { username, password } = values
        props.login(username, password)
      }
    })
  }

  if (user && user.token) {
    // return props.history.replace('/')
    return <Redirect to='/' />
  } else {
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="" />
          <h1>CNIAB Report System</h1>
        </header>
        <section className="login-content">
          <h2>登录</h2>
          <div>
            <Form onSubmit={handleSubmit} className="login-form">
              <Item>
                {getFieldDecorator('username', {
                  rules: [
                    { required: true, message: 'Please input your username!' }
                  ]
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                  />,
                )}
              </Item>
              <Item>
                {
                  getFieldDecorator('password', {
                    rules: [
                      { required: true, message: '密码必须输入' },
                      { min: 4, message: '最少4位' },
                      { max: 12, message: '最大12位' },
                      { pattern: /^[a-zA-Z0-9_]+$/, message: '字母数字下划线' }
                    ]
                  })(
                    <Input
                      type="password"
                      placeholder="输入密码"
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0, .25)' }} />}
                    />
                  )
                }
              </Item>
              <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
            </Form>
          </div>
        </section>
      </div >
    )
  }

}

const FormWrapper = Form.create()(Login)

const mapStateToProps = state => ({
  user: state.user
})
const mapDispatchToProps = { login }
export default connect(mapStateToProps, mapDispatchToProps)(FormWrapper)
