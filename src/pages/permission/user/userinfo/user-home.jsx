import React, { Component } from 'react'
import { Card, Button, Table, Modal } from 'antd'
import { reqUserList } from '../../../../api'
import dayjs from 'dayjs'

export default class User extends Component {
  state = {
    users: []
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'user_name'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '用户短名',
        dataIndex: 'ad_account'
      },
      {
        title: '电话',
        dataIndex: 'phone_no'
      },
      {
        title: '注册日期',
        dataIndex: 'createtime',
        render: createtime => {
          return dayjs(createtime).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: '首次登录日期',
        dataIndex: 'first_login_time'
      },
      {
        title: '最近一次登录日期',
        dataIndex: 'last_login_time'
      },
      {
        title: '登录次数',
        dataIndex: 'login_count'
      }
    ]
  }

  getUserList = async () => {
    const result = await reqUserList()
    this.setState({
      users: result.data
    })
  }

  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUserList()
  }

  render() {
    const { users } = this.state
    const title =
      <Button type="primary" onClick={
        () => this.props.history.push('/permission/user/single/addupdate')}>
        创建用户
      </Button>

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="user_id"
          dataSource={users}
          columns={this.columns}
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />
      </Card>
    )
  }
}
