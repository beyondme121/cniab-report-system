import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import GroupAdd from './group-add'
import { connect } from 'react-redux'
import { reqUserGroupList, reqUserGroupAdd } from '../../../api'
import { save_groups } from '../../../redux/actions/group-actions'

@connect(
  state => ({
    user: state.user,
    group: state.group
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
        render: () => (
          <div>
            <Button type="link">编辑组</Button>
            <Button type="link">删除组</Button>
            <Button type="link">添加用户</Button>
          </div>
        )
      }
    ]
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

  addGroup = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        const { group_name, group_desc, parent_group_id } = values
        const { status, msg } = await reqUserGroupAdd({ group_name, group_desc, parent_group_id })
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

  UNSAFE_componentWillMount() {
    this.initColums()
  }

  componentDidMount() {
    this.getGroupList()
  }

  render() {
    const { groups, isShow } = this.state
    const title = <Button type="primary" onClick={() => this.setState({ isShow: true })}>创建组</Button>
    return (
      <Card title={title}>
        <Table
          bordered
          dataSource={groups}
          columns={this.columns}
          pagination={{ defaultPageSize: 10, showQuickJumper: true }}
        />
        <Modal
          title="新增用户组"
          visible={isShow}
          onOk={this.addGroup}
          onCancel={() => {
            this.setState({ isShow: false })
            this.form.resetFields()
          }}
        >
          <GroupAdd setForm={form => this.form = form} />
        </Modal>
      </Card>
    )
  }
}
export default Group