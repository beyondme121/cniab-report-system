import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Select, Icon } from 'antd'
import { reqIcons } from '../../../api'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1663377_xnpc7c8ju7.js',
});

const { Option } = Select
const { Item } = Form

class MenuForm extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    menuList: PropTypes.array.isRequired
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
    const { menuList } = this.props
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
              initialValue: '',
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
              initialValue: '',
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
              initialValue: '',
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
              initialValue: '',
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
              initialValue: '',
              rules: [
                { required: true, message: '必须选择菜单图标' }
              ]
            })(
              <Select>
                <Option value="" key="-1">未选中</Option>
                {
                  iconList.map((item) =>
                    <Option key={item.IconId} value={item.IconText}>
                      {item.IconName} <IconFont type={item.IconText} />
                    </Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item label="菜单描述">
          {
            getFieldDecorator("MenuDescrition", {
              initialValue: ''
            })(
              <Input placeholder="请输入菜单描述" />
            )
          }
        </Item>
        <Item label="排序字段">
          {
            getFieldDecorator("SortKey", {
              initialValue: 1,
              rules: [
                { required: true, message: '排序字段必须填写' }
              ]
            })(
              <InputNumber min={1} max={100} />
            )
          }
        </Item>
        <Item label="菜单层级">
          {
            getFieldDecorator("RootDistance", {
              initialValue: 1,
              rules: [
                { required: true, message: '菜单层级必须填写' }
              ]
            })(
              <Select>
                <Option value="">请选择菜单层级</Option>
                <Option key="1" value="1">一级</Option>
                <Option key="2" value="2">二级</Option>
                <Option key="3" value="3">三级</Option>
              </Select>
            )
          }
        </Item>

      </Form>
    )
  }
}

export default Form.create()(MenuForm)
