import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import GroupAddOrUpdate from './group-add-update'
import { connect } from 'react-redux'
import {
  reqUserGroupList,
  reqUserGroupAddOrUpdate,
  reqUserGroupDelete
} from '../../../../api'
import { save_groups } from '../../../../redux/actions/group-actions'

@connect(
  state => ({
    user: state.user,
    groupList: state.groupList
  }),
  { save_groups }
)
class Group extends Component {
  state = {
    groups: [],
    isShow: false
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
        title: '创建人id',
        dataIndex: 'create_user_id'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time'
      },
      {
        title: '操作',
        render: (group) => (
          group.parent_group_id === '0' ? null :
            <div>
              <Button type="link" onClick={() => this.showUpdate(group)}>编辑</Button>
              <Button type="link" onClick={() => this.deleteGroup(group)}>删除</Button>
              <Button type="link">添加用户</Button>
            </div>
        )
      }
    ]
  }

  showAdd = () => {
    this.group = null
    this.setState({ isShow: true })
  }

  showUpdate = (group) => {
    this.group = group
    this.setState({ isShow: true })
  }

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
          this.setState({ isShow: false })
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

  UNSAFE_componentWillMount() {
    this.initColums()
  }

  componentDidMount() {
    this.getGroupList()
  }

  render() {
    const { groups, isShow } = this.state
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
          visible={isShow}
          onOk={this.addOrUpdateGroup}
          onCancel={() => {
            this.setState({ isShow: false })
            this.form.resetFields()
          }}
          width={600}
        >
          <GroupAddOrUpdate setForm={form => this.form = form} group={group} />
        </Modal>
      </Card>
    )
  }
}
export default Group