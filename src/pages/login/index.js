import React from 'react'
import { Form, Input, Button, Icon, message } from "antd";
import './index.less'
import logo from '../../assets/images/ABB_Logo.png'
import { connect } from 'react-redux'
import { loginAsync } from '../../redux/actions'
import { Redirect } from 'react-router-dom';

const Item = Form.Item


function Login(props) {

  const form = props.form
  const { getFieldDecorator } = form
  // const token = props.user
  // console.log("token: ", token)

  // 表单提交
  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   props.form.validateFields(async (err, values) => {
  //     if (!err) {
  //       const { username, password } = values
  //       props.login(username, password)
  //       message.success('登录成功')
  //     }
  //   })
  // }
  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields(async (err, values) => {
      if (!err) {
        let { username, password } = values
        // 验证登录并保存token到local中以及redux中
        await props.loginAsync(username, password)
        // props.history.replace('/')
      } else {
        message.error('表单验证失败')
      }
    })
  }

  if (props.user) {
    console.log('login props.user ----', props.user)
    // if (user && user.token) {
    // return props.history.replace('/')
    return <Redirect to='/' />
  } else {
    console.log('========1111111111111111')
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
// export default connect(
//   state => ({ token: state.user }),
//   { loginAsync }
// )(Form.create()(Login))

const FormWrapper = Form.create()(Login)

const mapStateToProps = state => ({
  user: state.user
})
const mapDispatchToProps = { loginAsync }
export default connect(mapStateToProps, mapDispatchToProps)(FormWrapper)
