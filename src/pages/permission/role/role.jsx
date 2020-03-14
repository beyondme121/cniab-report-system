import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import dayjs from 'dayjs'
import { reqRoleList, reqAddRole, reqAuthRoleMenu } from '../../../api'
import { PAGE_SIZE } from '../../../config/constants'
import AddRole from './add-role'
import AuthRole from './auth-role'

export default class Role extends Component {

  constructor(props) {
    super(props)
    this.state = {
      roles: [],              // 角色列表
      role: {},               // 选中的角色
      isShowAdd: false,
      isShowAuth: false
    }
    this.auth = React.createRef()
  }

  initColumns = () => {
    // TODO 需要在每次点击菜单时自动保存, bug
    let count = 1
    this.columns = [
      // {
      //   title: '序号',
      //   width: '5%',
      //   render: () => {
      //     return <div style={{ textAlign: 'center' }}>{count++}</div>
      //   }
      // },
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
          return dayjs(CreateTime).format('YYYY-MM-DD HH:mm')
        }
      },
      {
        title: '创建人',
        dataIndex: 'user_name'
      },
      {
        title: '授权时间',
        dataIndex: 'AuthTime',
        render: (AuthTime) => {
          return dayjs(AuthTime).format('YYYY-MM-DD HH:mm')
        }
      },
      {
        title: '授权人',
        dataIndex: 'AuthUserName'
      }
    ]
  }

  // 1. 获取用户角色列表 以及角色对应的菜单 (一个角色对应多个菜单)
  getRoles = async () => {
    let result = await reqRoleList()
    if (result.status === 0) {
      this.setState({
        roles: result.data
      })
    } else {
      message.warning(`${result.msg}`)
    }
  }

  // 2. 新增角色
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
          this.getRoles()
          // this.setState(state => {
          //   return {
          //     roles: [...state.roles, result.data]
          //   }
          // })
        } else {
          message.warning(result.msg, 2)
        }
      }
    })
  }

  // 3. 给角色授权, 添加角色的菜单
  updateRoleMenus = async () => {
    const { RoleId } = this.state.role         // 点击某一行时触发onRow回调设置的状态数据role
    let menus = this.auth.current.getMenus() // 调用子组件授权菜单组件的方法,收集选中的菜单ids
    // 请求更新角色的菜单
    const { status, msg } = await reqAuthRoleMenu({ RoleId, menus })
    if (status === 0) {
      message.success(msg)
      this.setState({
        isShowAuth: false,
        role: {}            // 更新用户授权后, 强制把当前选中的role清空,迫使用户再次点击角色进行设置
      })
      this.getRoles()
    }
  }

  // 1. 在点击Table某一行触发, 点击单选按钮不触发
  // 2. 设置Table每一行的属性,可以监听click,onDoubleClick等事件
  // 3. 在Table中设置该属性,就是对每行设置了监听
  onRow = (role) => {
    return {
      onClick: e => {
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
          size="small"
          rowKey="RoleId"
          dataSource={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role.RoleId],
            // 选中单选按钮的回调
            onSelect: (role) => {
              this.setState({ role })
            }
          }}
          // onRow={(role) => this.onRow(role)}        // 可以点击行选中一行
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
          title={
            <Button size="default" type="link" style={{ color: '#000' }}>{role.RoleName}角色授权</Button>
            // <Tag size="large">{role.RoleName}角色授权</Tag>
          }
          // modal框整体样式
          style={{
            top: 30,
            minWidth: 500,
          }}
          // modal框内容区域样式
          bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
          visible={isShowAuth}
          onOk={this.updateRoleMenus}
          onCancel={() => {
            this.setState({ isShowAuth: false })
          }}
        >
          <AuthRole role={role} ref={this.auth} />
        </Modal>
      </Card>
    )
  }
}
