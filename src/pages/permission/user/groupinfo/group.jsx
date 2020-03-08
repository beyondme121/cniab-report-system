import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import LinkButton from '../../../../components/link-button'
import GroupAddOrUpdate from './group-add-update'
import AddUsersIntoGroup from './add-user-into-group'
import AddRoleIntoGroup from './add-role-into-group'
import { connect } from 'react-redux'
import {
  reqUserGroupList,
  reqUserGroupAddOrUpdate,
  reqUserGroupDelete,
  reqAddUserIntoGroup,
  reqAddRoleIntoGroup
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
    this.refAddRoleIntoGroup = React.createRef()
  }

  initColums = () => {
    this.columns = [
      {
        title: '用户分组名',
        dataIndex: 'group_name',
        fixed: 'left',
        width: 200
      },
      {
        title: '分组描述',
        dataIndex: 'group_desc',
        width: 250
      },
      {
        title: '创建人',
        dataIndex: 'create_user_name',
        align: 'center',
        width: 100
      },
      {
        title: '更新人',
        dataIndex: 'update_user_name',
        align: 'center',
        width: 100
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        align: 'center',
        width: 160,
        render: (create_time) => {
          return create_time ? dayjs(create_time).format('YYYY-MM-DD HH:mm') : ''
        }
      },
      {
        title: '用户数',
        dataIndex: 'user_ids',
        align: 'right',
        // width: 100,
        // onCell: (record, rowIndex) => {
        //   console.log(record, rowIndex)
        // },
        render: (user_ids) => {
          return user_ids.length
        }
      },
      {
        title: '角色数',
        dataIndex: 'role_ids',
        align: 'right',
        // width: 100,
        render: role_ids => {
          return role_ids.length
        }
      },
      {
        title: '操作',
        fixed: 'right',
        width: 300,
        render: (group) => (
          group.parent_group_id === '0' ? null :
            <div>
              <LinkButton onClick={() => this.showUpdate(group)}>编辑</LinkButton>
              <LinkButton onClick={() => this.deleteGroup(group)}>删除</LinkButton>
              <LinkButton onClick={
                () => {
                  this.group = group
                  this.setState({ showAddUsersIntoGroup: true })
                }
              }>添加用户</LinkButton>
              <LinkButton onClick={() => {
                this.group = group
                this.setState({ showAddRoleIntoGroup: true })
              }}>角色授权</LinkButton>
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

  // 给用户组 添加 用户群
  handleAddUsersIntoGroup = async () => {
    // 获取所有选中的用户id
    let targetKeys = this.refAddUsersIntoGroup.current.getTargetKeys()
    if (targetKeys.length === 0) {
      message.warning('必须选择用户列表')
      return
    } else {
      let group_id = this.group.group_id
      const result = await reqAddUserIntoGroup({ group_id, user_ids: targetKeys })
      if (result.status === 0) {
        message.success(result.msg)
        this.setState({
          showAddUsersIntoGroup: false,
        })
        this.refAddUsersIntoGroup.current.setTargetKeys()
        this.getGroupList()
      } else {
        message.success(result.msg)
      }
    }
  }

  // 给用户组添加角色
  handleAddRoleIntoGroup = async () => {
    let targetKeys = this.refAddRoleIntoGroup.current.getTargetKeys()
    if (targetKeys.length === 0) {
      message.warning('必须选择角色列表')
      return
    } else {
      let group_id = this.group.group_id
      const result = await reqAddRoleIntoGroup({ group_id, role_ids: targetKeys })
      if (result.status === 0) {
        message.success(result.msg)
        this.setState({
          showAddRoleIntoGroup: false,
        })
        this.refAddRoleIntoGroup.current.setTargetKeys()
        this.getGroupList()
      } else {
        message.success(result.msg)
      }
    }
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
          scroll={{ x: 1200 }}
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
          style={{
            top: 50,
            minWidth: 800,
          }}
          bodyStyle={{ minHeight: 500 }}  // Modal body 样式
        >
          <AddRoleIntoGroup ref={this.refAddRoleIntoGroup} group={group} />
        </Modal>
      </Card>
    )
  }
}
export default Group