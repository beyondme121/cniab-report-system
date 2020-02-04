import React, { useEffect } from 'react'
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const Option = Select.Option

function AddCategoryForm(props) {
  const { parentId, categorys } = props
  const { getFieldDecorator } = props.form

  useEffect(() => {
    props.setForm(props.form)
  }, [])

  return (
    <Form>
      <Item>
        {
          getFieldDecorator("parent_id", {
            initialValue: parentId
          })(
            <Select>
              <Option key={0} value={0}>一级分类</Option>
              {
                categorys.map(c => <Option key={c._id} value={c._id}>{c.categoryName}</Option>)
              }
            </Select>
          )
        }
      </Item>
      <Item>
        {
          getFieldDecorator("categoryName", {
            initialValue: '',
            rules: [
              { required: true, message: '必须输入' }
            ]
          })(
            <Input placeholder="输入分类" />
          )
        }
      </Item>
    </Form>
  )
}

export default Form.create()(AddCategoryForm)
