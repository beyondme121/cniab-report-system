import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import GroupAddOrUpdate from './group-add-update'
import AddUsersIntoGroup from './add-user-into-group'
import { connect } from 'react-redux'
import {
  reqUserGroupList,
  reqUserGroupAddOrUpdate,
  reqUserGroupDelete,
  reqAddUserIntoGroup
} from '../../../../api'
import { save_groups } from '../../../../redux/actions/group-actions'
import dayjs from 'dayjs'

@connect(
  state => ({
    user: state.user,
    groupList: state.groupList
  }),
  { save_groups }
)
class Group extends Component {

  constructor(props) {
    super(props)
    this.state = {
      groups: [],
      showAddGroup: false,              // 添加用户组是否显示
      showAddUsersIntoGroup: false,     // 给用户组添加用户群是否显示
      showAddRoleIntoGroup: false       // 给用户组添加角色是否显示
    }
    this.refAddUsersIntoGroup = React.createRef()
  }

  initColums = () => {
    this.columns = [
      {
        title: '用户分组名',
        dataIndex: 'group_name'
      },
      {
        title: '分组描述',
        dataIndex: 'group_desc'
      },
      {
        title: '创建人',
        dataIndex: 'create_user_name'
      },
      {
        title: '更新人',
        dataIndex: 'update_user_name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => {
          return create_time ? dayjs(create_time).format('YYYY-MM-DD HH:mm') : ''
        }
      },
      {
        title: '用户数',

      },
      {
        title: '操作',
        render: (group) => (
          group.parent_group_id === '0' ? null :
            <div>
              <Button type="link" onClick={() => this.showUpdate(group)}>编辑</Button>
              <Button type="link" onClick={() => this.deleteGroup(group)}>删除</Button>
              <Button type="link" onClick={
                () => {
                  this.group = group
                  this.setState({ showAddUsersIntoGroup: true })
                }
              }>添加用户</Button>
              <Button type="link" onClick={() => {
                this.group = group
                this.setState({ showAddRoleIntoGroup: true })
              }}>角色授权</Button>
            </div>
        )
      }
    ]
  }

  // 显示添加组
  showAdd = () => {
    this.group = null
    this.setState({ showAddGroup: true })
  }
  // 显示编辑组
  showUpdate = (group) => {
    this.group = group
    this.setState({ showAddGroup: true })
  }
  // 获取组列表
  getGroupList = async () => {
    const result = await reqUserGroupList()
    if (result.status === 0) {
      this.props.save_groups(result.data)
      this.setState({
        groups: result.data
      })
    }
  }

  // 新增或更新组
  addOrUpdateGroup = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        const { group_name, group_desc, parent_group_id } = values
        const group_id = this.group && this.group.group_id
        const { status, msg } =
          await reqUserGroupAddOrUpdate({ group_id, group_name, group_desc, parent_group_id })
        if (status === 0) {
          message.success(msg)
          this.setState({ showAddGroup: false })
          this.form.resetFields()
          this.getGroupList()
        } else {
          message.error(msg)
        }
      }
    })
  }

  // 软删除用户组
  deleteGroup = async (group) => {
    const result = await reqUserGroupDelete(group)
    if (result.status === 0) {
      const { group_name } = result.data
      message.success(`删除${group_name}成功`)
      this.getGroupList()
    } else {
      message.warning('删除失败')
    }
  }

  handleAddUsersIntoGroup = async () => {
    // 获取所有选中的用户id
    let targetKeys = this.refAddUsersIntoGroup.current.getTargetKeys()
    let group_id = this.group.group_id
    const result = await reqAddUserIntoGroup({ group_id, user_ids: targetKeys })
    if (result.status === 0) {
      message.success('添加用户到用户组成功')
      this.setState({
        showAddUsersIntoGroup: false,
      })
      this.refAddUsersIntoGroup.current.setTargetKeys()
    }
  }

  // 给用户组添加角色
  handleAddRoleIntoGroup = () => {

  }

  UNSAFE_componentWillMount() {
    this.initColums()
  }

  componentDidMount() {
    this.getGroupList()
  }

  render() {
    const { groups, showAddGroup, showAddUsersIntoGroup, showAddRoleIntoGroup } = this.state
    const group = this.group || {}
    const title = <Button type="primary" onClick={this.showAdd}>创建组</Button>
    return (
      <Card title={title}>
        <Table
          bordered
          size={"small"}
          rowKey="group_id"
          dataSource={groups}
          columns={this.columns}
          pagination={{ defaultPageSize: 10, showQuickJumper: true }}
        />
        <Modal
          title={(group.group_id ? '修改' : '新增') + '用户组'}
          visible={showAddGroup}
          onOk={this.addOrUpdateGroup}
          onCancel={() => {
            this.setState({ showAddGroup: false })
            this.form.resetFields()
          }}
          width={600}
        >
          <GroupAddOrUpdate setForm={form => this.form = form} group={group} />
        </Modal>
        <Modal
          title="给用户组添加用户群"
          visible={showAddUsersIntoGroup}
          onOk={this.handleAddUsersIntoGroup}
          onCancel={() => {
            this.group = null
            this.setState({ showAddUsersIntoGroup: false })
            // 清空子组件的穿梭框的选中框清空
            this.refAddUsersIntoGroup.current.setTargetKeys()
          }}
          style={{
            top: 50,
            minWidth: 800,
          }}
          bodyStyle={{ minHeight: 500 }}  // Modal body 样式
        >
          <AddUsersIntoGroup ref={this.refAddUsersIntoGroup} group={group} />
        </Modal>
        <Modal
          title="给用户组添加角色"
          visible={showAddRoleIntoGroup}
          onOk={this.handleAddRoleIntoGroup}
          onCancel={() => {
            this.group = null
            this.setState({ showAddRoleIntoGroup: false })
          }}
        >
          hello
        </Modal>
      </Card>
    )
  }
}
export default Group