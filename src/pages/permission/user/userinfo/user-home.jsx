import React, { Component } from 'react'
import { Card, Button, Table, Modal } from 'antd'


export default class User extends Component {
  state = {
    users: []
  }

  componentDidMount() {

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
          rowKey="UserId"
          dataSource={users}
          columns={this.columns}
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />
      </Card>
    )
  }
}
