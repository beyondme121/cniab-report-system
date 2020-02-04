import React, { useEffect } from 'react'
import { Form, Input } from 'antd'

const Item = Form.Item

// 更新分类组件(子组件), 内部处理每个表单项的校验和收集, 父组件获取子组件的form对象(通过父组件向子组件传递函数,
// 子组件调用把form对象传递进函数, 父组件就可以拿到函数接收的参数->form对象),
// 进行统一校验validate
function UpdateCategoryForm(props) {

  const {
    // 父组件传递的参数 
    categoryName,
    setForm,
    // Form.create()高阶组件传递的form 对象
    form
  } = props

  // 只需要执行一次
  useEffect(() => {
    console.log("form: ", form)
    setForm(form)
  }, [])

  return (
    <Form>
      <Item>
        {
          props.form.getFieldDecorator('categoryName', {
            initialValue: categoryName.categoryName,
            rules: [
              {
                required: true, message: '必须填写分类名称'
              }
            ]
          })(
            <Input type="text" placeholder="输入分类名称" />
          )
        }
      </Item>
    </Form>
  )
}

export default Form.create()(UpdateCategoryForm)
