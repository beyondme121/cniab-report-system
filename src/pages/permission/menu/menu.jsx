import React, { Component } from 'react'
import { Card, Table, Button, Modal, message, Icon } from 'antd'
import MenuForm from './menu-form'
import { PAGE_SIZE } from '../../../config/constants'
import { reqAddMenu, reqMenuList } from '../../../api'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1663377_xnpc7c8ju7.js',
});

export default class Menu extends Component {
  state = {
    menuList: [],
    menuFormVisiable: false,
  }

  initColumns = () => {
    this.columns = [
      {
        title: '中文名',
        dataIndex: 'MenuNameCN'
      },
      {
        title: '权限描述',
        dataIndex: 'MenuDescrition'
      },
      {
        title: '菜单路径',
        dataIndex: 'MenuPath'
      },
      {
        title: '菜单状态',
        dataIndex: 'Status',
        render: Status => {
          return Status === 1 ? '正常' : '作废'
        }
      },
    ]
  }

  getMenuList = async () => {
    const result = await reqMenuList()
    console.log("menu: ", result.data)
    if (result.status === 0) {
      this.setState({
        menuList: result.data
      })
    }
  }

  handleMenuOk = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 收集数据 后端接口要严格判断角色的唯一性
        const result = await reqAddMenu(values)
        if (result.status === 0) {
          message.success(result.msg, 1)
          this.form.resetFields()
          this.setState({
            menuFormVisiable: false
          })
          this.getMenuList()
        } else {
          message.warning(result.msg, 2)
        }
      }
    })
  }

  handleMenuCancel = () => {
    this.setState({
      menuFormVisiable: false,
    })
    this.form.resetFields()
  }

  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getMenuList()
  }

  render() {
    const { menuList, menuFormVisiable } = this.state
    const title = (
      <Button type="primary" onClick={() => this.setState({ menuFormVisiable: true })}>
        添加菜单
        <IconFont type="icon-xingye" />
      </Button>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="MenuId"
          dataSource={menuList}
          columns={this.columns}
          pagination={{ pageSize: PAGE_SIZE }}
        />
        <Modal
          title="添加菜单"
          visible={menuFormVisiable}
          onOk={this.handleMenuOk}
          onCancel={this.handleMenuCancel}
        >
          <MenuForm setForm={form => this.form = form} menuList={menuList} />
        </Modal>
      </Card>
    )
  }
}
