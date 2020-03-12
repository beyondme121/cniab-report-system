import React, { Component } from 'react'
import { Card, Table, Button, Modal, message, Icon } from 'antd'
import MenuForm from './menu-form'
import { PAGE_SIZE } from '../../../config/constants'
import { reqAddOrUpdateMenu } from '../../../api'
import { connect } from 'react-redux'
import { getMenuList } from '../../../redux/actions/menu-actions'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1663377_xnpc7c8ju7.js',
});

@connect(
  state => ({
    menuList: state.menu      //  菜单数组
  }),
  { getMenuList }
)
class Menu extends Component {
  state = {
    menuFormVisiable: false,
  }

  initColumns = () => {
    this.columns = [
      {
        title: '中文名',
        dataIndex: 'MenuNameCN'
      },
      {
        title: '资源描述',
        dataIndex: 'MenuDescrition'
      },
      {
        title: '菜单路径',
        dataIndex: 'MenuPath'
      },
      {
        title: '排序',
        width: '4%',
        dataIndex: 'SortKey',
        render: sortkey => (
          <div style={{ textAlign: "right" }}>{sortkey}</div>
        )
      },
      {
        title: '资源类型',
        dataIndex: 'type'
      },
      {
        title: '权限类型',
        dataIndex: 'auth_type'
      },
      {
        title: '操作',
        width: '12%',
        render: (item) => (
          item.ParentMenuId === '0000' ? null :
            <>
              <Button type="link" onClick={() => this.showMenuForm(item)}>编辑</Button>
              <Button type="link">删除</Button>
            </>
        )
      }
    ]
  }

  // 点击确定(新增或修改)
  handleMenuOk = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        values.menu_id = this.menu && this.menu.MenuId
        // TODO 接口处理新增或更新菜单的唯一性(菜单名称+路径)
        const result = await reqAddOrUpdateMenu(values)
        if (result.status === 0) {
          message.success(result.msg, 1)
          this.form.resetFields()
          this.setState({
            menuFormVisiable: false
          })
          this.props.getMenuList()
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

  // 编辑的回调
  showMenuForm = (menu) => {
    this.menu = menu
    this.setState({
      menuFormVisiable: true
    })
  }

  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  render() {
    const { menuFormVisiable } = this.state
    const menuList = this.props.menuList || {}
    const menu = this.menu || {}
    const title = (
      <Button type="primary" onClick={() => {
        this.menu = null
        this.setState({ menuFormVisiable: true })
      }}>
        添加菜单
        <IconFont type="icon-xuqiutianbao" />
      </Button>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          size={"small"}
          rowKey="MenuId"
          dataSource={menuList}
          columns={this.columns}
          pagination={{ pageSize: PAGE_SIZE }}
        />
        <Modal
          title="添加菜单"
          bordered={false}
          visible={menuFormVisiable}
          onOk={this.handleMenuOk}
          onCancel={this.handleMenuCancel}
          style={{
            top: 20,
            minWidth: 600,
          }}
          bodyStyle={{ padding: '8px 0 0 0' }}
        >
          <MenuForm
            setForm={form => this.form = form}
            menuList={menuList}
            menu={menu}
          />
        </Modal>
      </Card>
    )
  }
}

export default Menu