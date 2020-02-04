import React, { useState, useEffect } from 'react'
import { Card, Icon, Button, Table } from 'antd'
import LinkButton from '../../components/link-button'

export default function Category() {

  const [columns, setColumns] = useState([])
  const [categorys, setCategorys] = useState([])
  const [title, setTitle] = useState('一级标题')

  const extra = (
    <Button type="primary" onClick={() => setTitle(Math.random())}>
      <Icon type="plus" />
      添加
    </Button>
  )



  // 列信息配置
  useEffect(() => {
    let _columns = [
      {
        title: '分类名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        width: 300,
        render: () => {
          return (
            <>
              <LinkButton>修改</LinkButton>
              <LinkButton>查看</LinkButton>
            </>
          )
        }
      }
    ]
    setColumns(_columns)
    return () => {
      console.log('组件卸载')
    }
  }, [])

  // 发请求获取数据 模拟异步
  useEffect(() => {
    let _dataSource = [
      {
        parentId: 0,
        id: 1,
        name: 'application development'
      },
      {
        parentId: 0,
        id: 2,
        name: 'report development'
      },
      {
        parentId: 0,
        id: 3,
        name: 'bug fixing'
      }
    ]
    setTimeout(() => {
      setCategorys(_dataSource)
    }, 1000)
  }, [])

  return (
    <div>
      <Card
        title={title}
        extra={extra}
      >
        <Table
          dataSource={categorys}
          columns={columns}
          bordered
          rowKey="id"
        />
      </Card>
    </div>
  )
}
