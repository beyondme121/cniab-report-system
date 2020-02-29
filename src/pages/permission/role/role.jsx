import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import dayjs from 'dayjs'
import { reqRoleList, reqAddRole } from '../../../api'

import AddRole from './add-role'
import AuthRole from './auth-role'

export default class Role extends Component {
  state = {
    roles: [],  // 角色列表
    role: {},    // 选中的角色
    isShowAdd: false,
    isShowAuth: false
  }

  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'RoleName'
      },
      {
        title: '角色描述',
        dataIndex: 'RoleDesc'
      },
      {
        title: '创建时间',
        dataIndex: 'CreateTime',
        render: (CreateTime) => {
          return dayjs(CreateTime).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: '创建人',
        dataIndex: 'CreateUserId'
      },
      {
        title: '授权时间',
        dataIndex: 'AuthTime',
      },
      {
        title: '授权人',
        dataIndex: 'AuthUserId'
      }
    ]
  }

  // 获取用户角色列表
  getRoles = async () => {
    let result = await reqRoleList()
    if (result.status === 0) {
      this.setState({
        roles: result.data
      })
    }
  }

  // 增加角色
  addRole = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 收集数据 后端接口要严格判断角色的唯一性
        const result = await reqAddRole(values)
        if (result.status === 0) {
          message.success(result.msg, 1)
          this.form.resetFields()
          this.setState({
            isShowAdd: false
          })
          this.setState(state => {
            return {
              roles: [...state.roles, result.data]
            }
          })
        } else {
          message.warning(result.msg, 2)
        }
      }
    })
  }

  authRole = () => {

  }

  // table选中的一行(监听onClick等事件监听)
  onRow = (role) => {
    return {
      onClick: e => {
        // 当点击后,设置当前行的role为state中的role
        this.setState({ role })
      }
    }
  }

  UNSAFE_componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getRoles()
  }

  render() {
    const { roles, role, isShowAdd, isShowAuth } = this.state
    const title = (
      <span>
        <Button type="primary" onClick={() => this.setState({ isShowAdd: true })} style={{ marginRight: '10px' }}>新增角色</Button>
        <Button type="primary" disabled={!role.RoleId} onClick={() => this.setState({ isShowAuth: true })}>设置角色菜单</Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="RoleId"
          dataSource={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: 2 }}
          rowSelection={{ type: 'radio', selectedRowKeys: [role.RoleId] }}
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ isShowAdd: false })
            this.form.resetFields()
          }}
        >
          <AddRole setForm={form => this.form = form} />
        </Modal>
        <Modal
          title="角色授权"
          visible={isShowAuth}
          onOk={this.authRole}
          onCancel={() => {
            this.setState({ isShowAuth: false })
            // this.form.resetFields()
          }}
        >
          <AuthRole role={role} />
        </Modal>

      </Card>
    )
  }
}
