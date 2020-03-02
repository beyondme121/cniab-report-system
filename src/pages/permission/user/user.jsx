import React, { Component } from 'react'
import { Card, Button, Table, Modal } from 'antd'
import { } from '../../../api'
export default class User extends Component {
  state = {
    users: []
  }

  componentDidMount() {

  }

  render() {

    const title = <Button type="primary">创建用户</Button>

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
