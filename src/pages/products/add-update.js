import React, { useState, useEffect, useRef } from 'react'
import { Card, Icon, Form, Input, Button, Cascader } from 'antd'
import { reqCategorys } from '../../api'
import LinkButton from '../../components/link-button'

const { Item } = Form
const { TextArea } = Input

function AddUpdate(props) {

  const [options, setOptions] = useState([])
  const isUpdateRef = useRef()
  const productRef = useRef()
  const { getFieldDecorator } = props.form


  // 点击确定 表单的统一校验 以及 数据收集 请求后台API
  const handleSubmit = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  // 表单域校验函数
  // 验证输入价格 是否大于0， callback必须调用, 成功就是不传递参数
  const validatePrice = (rule, value, callback) => {
    // value * 1: 转化为数值类型
    if (value * 1 > 0) {
      callback()
    } else {
      callback('金额不能小于0')
    }
  }

  // 初始化options, 根据
  const initOptions = async categorys => {
    const options = categorys.map(item => ({
      value: item._id,
      label: item.categoryName,
      isLeaf: false,
    }))
    const { pCategoryId = 1 } = productRef.current
    // 如果是二级分类产品的更新
    if (isUpdateRef.current && pCategoryId != 0) {
      // 请求二级数据
      const subCategorys = await getCategorys(pCategoryId)
      // 生成二级下拉列表的option
      const childOptions = subCategorys.map(item => ({
        value: item._id,
        label: item.categoryName,
        isLeaf: true
      }))
      // 二级下拉列表生成后, 要将二级列表复制给一级的children属性上, 先找对应的一级
      const targetOption = options.find(option => option.value === pCategoryId)
      targetOption.children = childOptions
    }

    setOptions(options)
  }


  // 获取分类数据 1/2级分类
  const getCategorys = async parentId => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      // 将server返回的数据"组装"成级联组件options需要的格式
      // 如果是一级分类, 直接"组装"options配置项, 如果是下一级,就直接返回数据, 在loadData中组装
      if (parentId === 0) {
        initOptions(categorys)
      } else {
        return categorys
      }
    }
  }

  const loadData = async selectedOptions => {
    // 点击选中项option
    const targetOption = selectedOptions[selectedOptions.length - 1]; // {value: 2, label: "报表", isLeaf: false}
    targetOption.loading = true
    // 根据选中的分类 获取二级分类列表
    const subCategorys = await getCategorys(targetOption.value)
    // 
    targetOption.loading = false
    if (subCategorys && subCategorys.length > 0) {
      const subOptions = subCategorys.map(item => ({
        value: item._id,
        label: item.categoryName,
        isLeaf: true
      }))
      targetOption.children = subOptions
    } else {
      targetOption.isLeaf = true
    }
    setOptions([...options])
    // setOptions(options)   // 错误写法, 
  }


  useEffect(() => {
    // 初始获取一级分类
    getCategorys(0)
  }, [])



  // 获取点击"修改商品"路由跳转过来的参数 product对象
  productRef.current = props.location.state
  // 判断是否传递了数据对象, !!表示将一个值转换为布尔值,比如 !!undefined === false
  isUpdateRef.current = !!productRef.current  // 点击更新就是true, 新增没有product数据传递就是false
  // 如果是新增产品, product就是undefined, 再结构属性就会报错, 因为不能结构undefined
  productRef.current = productRef.current || {}

  // 获取路由跳转过来的产品对象 并 解构
  const { _id, name, code, price, categoryId = 11, pCategoryId = 1 } = productRef.current


  // 模拟获取分类id 和 parentId, 实际上, product应该包含parentId, 如果不是一级分类
  const categoryIds = []
  if (isUpdateRef.current) {
    if (pCategoryId === 0) {
      categoryIds.push(categoryId)
    } else {
      categoryIds.push(pCategoryId)
      categoryIds.push(categoryId)
    }
  }

  // Card左上角title
  const title = (
    <span>
      <LinkButton onClick={() => props.history.goBack()}>
        <Icon type="arrow-left" />
      </LinkButton>
      <span>{isUpdateRef.current ? '更新产品' : '添加产品'}</span>
    </span>
  )
  // Form的样式
  const formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 10 }
  }

  return (
    <Card title={title}>
      <Form {...formItemLayout}>
        <Item label="产品名称">
          {
            getFieldDecorator("name", {
              initialValue: name,
              rules: [
                { required: true, message: '必须输入产品名称' }
              ]
            })(
              <Input placeholder="请输入商品名称" />
            )
          }
        </Item>
        <Item label="物料号">
          {
            getFieldDecorator("code", {
              initialValue: code,
              rules: [
                { required: true, message: '必须输入物料号' }
              ]
            })(
              <TextArea placeholder="输入物料号" autoSize={{ minRows: 4, maxRows: 6 }} />
            )
          }
        </Item>
        <Item label="产品价格">
          {
            getFieldDecorator("price", {
              initialValue: price,
              rules: [
                { required: true, message: "必须输入价格" },
                { validator: validatePrice }
              ]
            })(
              <Input type="number" placeholder="" addonAfter="元" />
            )
          }
        </Item>
        <Item label="产品分类">
          {
            getFieldDecorator("categoryIds", {
              initialValue: categoryIds,
              rules: [
                { required: true, message: '必须指定商品分类' }
              ]
            })(
              <Cascader
                placeholder='请指定商品分类'
                options={options}
                loadData={loadData}
              />
            )
          }
        </Item>
        <Item>
          <Button type="primary" onClick={handleSubmit}>提交</Button>
        </Item>
      </Form>
    </Card>
  )
}

export default Form.create()(AddUpdate)
