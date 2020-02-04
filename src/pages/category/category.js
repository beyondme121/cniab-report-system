import React, { useState, useEffect, useRef } from 'react'
import { Card, Icon, Button, Table, message, Modal } from 'antd'
import LinkButton from '../../components/link-button'

import UpdateCategoryForm from './update-category-form'
import AddCategoryForm from './add-category-form'

import {
  reqCategorys,     // 请求分类列表(一级/二级/...)
  reqUpdateCategory,
  reqAddCategory
} from '../../api'

export default function Category() {

  const [loading, setLoading] = useState(false)
  const [showStatus, setShowStatus] = useState(0)   // 0:隐藏 1:显示修改 2:显示添加
  const [parentId, setParentId] = useState(0)
  const [parentName, setParentName] = useState('')
  // 分类数据
  const [categorys, setCategorys] = useState([])
  const [subCategorys, setSubCategorys] = useState([])
  // 表格字段
  const [columns, setColumns] = useState([])

  // 保存当前的分类记录或叫做对象
  let categoryRef = useRef({})
  let formRef = useRef({})

  // 表格字段信息
  const columnRef = useRef([
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      key: 'categoryName'
    },
    {
      title: '操作',
      width: 300,
      render: (category) => {
        return (
          <>
            <LinkButton onClick={() => showUpdateModal(category)}>修改</LinkButton>
            {
              parentId === 0 ? <LinkButton onClick={() => showSubCategory(category)}>查看下级分类</LinkButton> : null
            }
          </>
        )
      }
    }
  ])


  // 获取一级或者二级分类列表
  const getCategorys = async (pid) => {
    setLoading(true)
    pid = pid || parentId
    const result = await reqCategorys(pid)
    setLoading(false)
    if (result.status === 0) {
      const category = result.data
      if (pid === 0) {
        setCategorys(category)
      } else {
        setSubCategorys(category)
      }
    } else {
      message.error('未成功获取分类列表')
    }
  }

  const showSubCategory = async (category) => {
    // 更新状态
    setParentId(category._id)
    setParentName(category.categoryName)
  }

  // 1. 显示一级分类列表: 设置parentId为0, name为空, 目的是Card左上角的title的内容如果有二级就要显示二级名称,没有就显示''
  // 关键: 重新设置了组件的state状态, 原来的思路是: 设置状态, 
  const showCategorys = () => {
    setParentId(0)
    setParentName('')
    setSubCategorys([])
  }

  // 2. --------------------------- 修改分类 功能函数组---------------------------
  // 2.1 点击修改显示Modal
  const showUpdateModal = category => {
    categoryRef.current = category
    setShowStatus(1)
  }

  // 2.2 点击确定 表单验证 统一验证 提交请求 隐藏modal
  const categoryUpdate = () => {
    formRef.current.validateFields(async (err, values) => {
      if (!err) {
        // 1. 隐藏modal
        setShowStatus(0)
        // 2. 准备数据
        const categoryId = categoryRef.current._id
        const { categoryName } = values
        // 清空输入内容
        formRef.current.resetFields()
        // 3. 发起请求API
        // console.log("data:", { categoryId, categoryName })
        const result = await reqUpdateCategory({ categoryId, categoryName })
        if (result.status === 0) {
          message.success(result.message)
          getCategorys()
        }
      }
    })
  }

  // --------------------------- 添加分类 ---------------------------
  const categoryAdd = () => {
    formRef.current.validateFields(async (err, values) => {
      if (!err) {
        // {parentId: 0, categoryName: "dddd"}
        // 1. 隐藏modal
        setShowStatus(0)
        // 2. 收集数据 组织数据
        const { parent_id, categoryName } = values
        // 重置form表单元素
        formRef.current.resetFields()
        const result = await reqAddCategory({ parentId: parent_id, categoryName })
        if (result.status === 0) {
          // 如果收集的数据中 父类别id === 当前状态的父类别id --> (说明是在二级类别中创建)
          if (parent_id === parentId) {
            // 此时状态中的parentId是二级id
            getCategorys()
          } else if (parent_id === 0) {
            getCategorys(0)
          }
        }
      }
    })
  }

  // 2.3 两个modal公用的隐藏Modal
  const handleCancel = () => {
    setShowStatus(0)
    formRef.current.resetFields()
  }

  // 初始化 Table的列信息 函数
  const initColums = () => {
    setColumns([
      {
        title: '分类名称',
        dataIndex: 'categoryName',
        key: 'categoryName'
      },
      {
        title: '操作',
        width: 300,
        render: (category) => {
          return (
            <>
              <LinkButton onClick={() => showUpdateModal(category)}>修改</LinkButton>
              {
                parentId === 0 ? <LinkButton onClick={() => showSubCategory(category)}>查看下级分类</LinkButton> : null
              }
            </>
          )
        }
      }
    ])
  }

  // 副作用函数
  useEffect(() => {
    initColums()
    getCategorys()
  }, [parentId, parentName])

  // Card左侧标题
  const title = parentId === 0 ? '一级分类列表' : (
    <span>
      <LinkButton onClick={showCategorys}>一级分类列表</LinkButton>
      <Icon type="arrow-right" style={{ marginRight: 5 }} />
      <span>{parentName}</span>
    </span>
  )

  const extra = (
    <Button type="primary" onClick={() => setShowStatus(2)}>
      <Icon type="plus" />
      添加
    </Button>
  )

  return (
    <div>
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          loading={loading}
          dataSource={parentId === 0 ? categorys : subCategorys}
          // columns={columnRef.current}
          columns={columns}
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />
        {/* 更新分类form */}
        <Modal
          title="修改类别"
          visible={showStatus === 1}
          onOk={categoryUpdate}
          onCancel={handleCancel}
        >
          <UpdateCategoryForm categoryName={categoryRef.current} setForm={(form) => {
            console.log("UpdateCategoryForm: ", form)
            formRef.current = form
          }} />
        </Modal>
        <Modal
          title="添加分类"
          visible={showStatus === 2}
          onOk={categoryAdd}
          onCancel={handleCancel}
        >
          {/* categorys: 用于显示下拉列表的 一级分类数据 */}
          {/* parentId:  点击新增按钮时, 当前界面处于的父类别id, 如果是查看子分类后,parentId就是一个具体的id比如, 2, 
                        如果是一级类别，id就是0
          */}
          <AddCategoryForm
            categorys={categorys}
            parentId={parentId}
            setForm={form => formRef.current = form}
          />
        </Modal>
      </Card>
    </div>
  )
}
