import React, { Component } from 'react'
import { Card, Form, Input, Button, Icon, Row, Col, message, TreeSelect } from 'antd'
import { reqAddUser, reqUserList, reqRoleList } from '../../../../api'
import setTreeMenuFilter from '../../../../utils/setTreeMenuFilter'

const { Item } = Form
const { TreeNode } = TreeSelect

@Form.create()
class AddUpdateUser extends Component {

  state = {
    users: [],
    checkedKeys: undefined,
    roleList: []
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const result = await reqAddUser(values)
        if (result.status === 0) {
          message.success(result.msg)
          // this.props.history.push('/permission/user/single')
          this.props.history.goBack()
          await reqUserList()
        }
      }
    })
  }

  onChange = checkedKeys => {
    this.setState({ checkedKeys })
  }

  // 获取角色列表
  getRoleList = async () => {
    const result = await reqRoleList()
    if (result.status === 0) {
      this.getTreeNodes(result.data)
      this.setState({
        roleList: result.data
      })
    }
  }

  //将父子结构的数据 转换为 树状结构的数据
  getTreeNodes = (roleList) => {
    let treeData = setTreeMenuFilter(roleList, {
      id: 'RoleId',
      parentId: 'ParentRoleId',
      children: 'children',
      rootId: '0000'
    })
    this.roleList = this.makeTreeNode(treeData)
  }
  // 根据整理后的菜单json数据, 带有children属性的数据 生成
  makeTreeNode = (roleList) => {
    let data = roleList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.RoleName} value={item.RoleId} key={item.RoleId}>
          {item.children ? this.makeTreeNode(item.children) : null}
        </TreeNode>
      )
      return pre
    }, [])
    return data
  }

  componentDidMount() {
    this.getRoleList()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 8 }, // 右侧包裹的宽度
    }

    const title = (
      <div>
        <Button type="link" onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" />
          <span>添加用户</span>
        </Button>
      </div>
    )

    if (!this.roleList) return null

    return (
      <Card title={title}>
        <Form onSubmit={this.handleSubmit} {...formItemLayout}>
          <Item label="用户名">
            {
              getFieldDecorator('user_name', {
                initialValue: '',
                rules: [
                  { required: true, message: '必须填写用户名' }
                ]
              })(
                <Input placeholder="填写用户名" />
              )
            }
          </Item>
          <Item label="密码">
            {
              getFieldDecorator('password', {
                initialValue: '',
                rules: [
                  { required: true, message: '必须填写密码' }
                ]
              })(
                <Input placeholder="填写密码" />
              )
            }
          </Item>
          <Item label="邮箱">
            {
              getFieldDecorator('email', {
                initialValue: '',
                rules: [
                  { required: true, message: '必须填写用户名' }
                ]
              })(
                <Input placeholder="填写用户名" />
              )
            }
          </Item>
          <Item label="AD账号">
            {
              getFieldDecorator('ad_account', {
                initialValue: ''
              })(
                <Input placeholder="填写AD账号" />
              )
            }
          </Item>
          <Item label="电话">
            {
              getFieldDecorator('phone_no', {
                initialValue: '',
                // rules: [
                //   { required: true, message: '必须填写用户名' }
                // ]
              })(
                <Input placeholder="填写电话" />
              )
            }
          </Item>
          <Item label="用户所属角色">
            {
              getFieldDecorator('roles', {
                initialValue: null,
                rules: [
                  { required: true, message: '必须选择一个角色' }
                ]
              })(
                <TreeSelect
                  checkable
                  showSearch
                  treeDefaultExpandAll={true}
                  treeCheckable={true}
                  allowClear
                  autoClearSearchValue
                  treeCheckable
                  showCheckedStrategy='SHOW_PARENT'
                  placeholder="Please select"
                  dropdownStyle={{ maxHeight: 800, overflow: 'auto' }}
                  onChange={this.onChange}
                  setFieldsValue={this.state.checkedKeys}
                >
                  {this.roleList.length > 0 ? this.roleList : null}
                </TreeSelect>
              )
            }
          </Item>
          <Row>
            <Col span={4} offset={6}>
              <Item>
                <Button>取消</Button>
              </Item>
            </Col>
            <Col span={4} pull={2}>
              <Item>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Item>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }
}
export default AddUpdateUser