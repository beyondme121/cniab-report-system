import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Select, Icon } from 'antd'
import { reqIcons } from '../../../api'
import { MyIcon } from '../../../components/my-icon'
// const IconFont = Icon.createFromIconfontCN({
//   scriptUrl: '//at.alicdn.com/t/font_1663377_xnpc7c8ju7.js',
// });

const { Option } = Select
const { Item } = Form

class MenuForm extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    menuList: PropTypes.array.isRequired,   // 使用redux也行
    menu: PropTypes.object
  }

  state = {
    iconList: []
  }

  getIcons = async () => {
    const result = await reqIcons()
    if (result.status === 0) {
      this.setState({
        iconList: result.data
      })
    }
  }

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form)
  }

  componentDidMount() {
    this.getIcons()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { menuList, menu } = this.props
    const
      { MenuNameEN, MenuNameCN, ParentMenuId, MenuPath, MenuIcon,
        MenuDescrition, SortKey, type, auth_type } = menu
    const { iconList } = this.state
    const formItemLayout = {
      labelCol: { span: 5 },    // 左侧label的宽度
      wrapperCol: { span: 12 }, // 右侧包裹的宽度
      colon: false              // label文本右侧的冒号
    }
    return (
      <Form {...formItemLayout}>
        <Item label="菜单英文名">
          {
            getFieldDecorator("MenuNameEN", {
              initialValue: MenuNameEN,
              rules: [
                { required: true, message: '菜单英文名必须填写' },
              ]
            })(
              <Input placeholder="请输入菜单英文名" />
            )
          }
        </Item>
        <Item label="菜单中文名">
          {
            getFieldDecorator("MenuNameCN", {
              initialValue: MenuNameCN,
              rules: [
                { required: true, message: '菜单中文名必须填写' },
                { minLength: 3, message: '菜单中文名长度必须大于3' },
              ]
            })(
              <Input placeholder="请输入菜单中文名" />
            )
          }
        </Item>
        <Item label="父级菜单">
          {
            getFieldDecorator("ParentMenuId", {
              initialValue: ParentMenuId,
              rules: [
                { required: true, message: '父级菜单必须选择' }
              ]
            })(
              <Select>
                {
                  menuList.map(item =>
                    <Option key={item.MenuId} value={item.MenuId}>{item.MenuNameCN} - {item.MenuPath}</Option>
                  )
                }
              </Select>
            )
          }
        </Item>
        <Item label="菜单路径">
          {
            getFieldDecorator("MenuPath", {
              initialValue: MenuPath,
              rules: [
                { required: true, message: '菜单路径必须填写' }
              ]
            })(
              <Input placeholder="请输入菜单路径" />
            )
          }
        </Item>
        <Item label="菜单图标">
          {
            getFieldDecorator("MenuIcon", {
              initialValue: MenuIcon,
              rules: [
                { required: true, message: '必须选择菜单图标' }
              ]
            })(
              <Select>
                <Option value="" key="-1">未选中</Option>
                {
                  iconList.map((item) =>
                    <Option key={item.IconId} value={item.IconText}>
                      {item.IconName} <MyIcon type={item.IconText} />
                      {/* {item.IconName} <IconFont type={item.IconText} /> */}
                    </Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item label="菜单描述">
          {
            getFieldDecorator("MenuDescrition", {
              initialValue: MenuDescrition
            })(
              <Input placeholder="请输入菜单描述" />
            )
          }
        </Item>
        <Item label="排序字段">
          {
            getFieldDecorator("SortKey", {
              initialValue: SortKey || 10,
              rules: [
                { required: true, message: '排序字段必须填写' }
              ]
            })(
              <InputNumber min={1} max={10000} />
            )
          }
        </Item>
        <Item label="资源类别">
          {
            getFieldDecorator("type", {
              initialValue: type || 'menu',
              rules: [
                { required: true, message: '资源类别必须选择' }
              ]
            })(
              <Select>
                {/* <Option value="">请选择资源类别</Option> */}
                <Option key="1" value="menu">菜单</Option>
                <Option key="2" value="link">链接</Option>
              </Select>
            )
          }
        </Item>
        <Item label="授权类别">
          {
            getFieldDecorator("auth_type", {
              initialValue: auth_type || 'authorized',
              rules: [
                { required: true, message: '授权类别必须选择' }
              ]
            })(
              <Select>
                {/* <Option value="">请选择授权类别</Option> */}
                <Option key="1" value="public">公开</Option>
                <Option key="2" value="authorized">权限控制</Option>
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(MenuForm)
