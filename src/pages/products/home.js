import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Card,
  Select,
  Input,
  Button,
  Table,
  Icon,
  Row,
  Col,
  message
} from 'antd'
import LinkButton from '../../components/link-button'
import {
  // reqAllProducts,
  reqProductListByPage,
  reqSearchProductListByPage,
  reqUpdateProductStatus
} from '../../api'
import { PAGE_SIZE } from '../../config/constants'

const Option = Select.Option
const { Search } = Input

export default function Home(props) {
  // Table的数据以及状态
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  // 分页配置项
  const [total, setTotal] = useState(0)
  // 查询条件的受控组件收集(监听事件自动收集数据)
  const [searchType, setSearchType] = useState('name')
  const [searchText, setSearchText] = useState('')
  // 当前页码
  const pageNumRef = useRef(1)

  // 初始化Card的左右两侧, 每次组件更新都进行渲染
  // ----------------------- 初始化Card 配置信息 -----------------------
  const title = (
    <Row>
      <Col span={4}>
        <Select value={searchType} style={{ width: 180 }} onChange={value => setSearchType(value)}>
          <Option value="name">按名称搜索</Option>
          <Option value="voltage">按Voltage搜索</Option>
        </Select>
      </Col>
      <Col span={6}>
        {/* <Input
          placeholder="搜索关键字"
          style={{ width: 270 }}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        /> */}
        <Search
          placeholder="搜索关键字"
          style={{ width: 270 }}
          // onSearch={value => {
          //   getProductsByPage(1)
          // }}
          onPressEnter={e => { getProductsByPage(1) }}
          onChange={e => setSearchText(e.target.value)}
        />
      </Col>
      <Col span={2}>
        <Button type="primary" onClick={() => getProductsByPage(1)}>搜索</Button>
      </Col>
    </Row>
  )

  const extra = (
    <Button type="primary" onClick={() => props.history.push('/sales/product/addupdate')}>
      <Icon type="plus" />
      添加商品
    </Button>
  )

  // ----------------------- 初始化Table信息 -----------------------
  let columns = [
    {
      title: '序号',
      dataIndex: 'rownumber'
    },
    {
      title: '商品名称',
      dataIndex: 'name'
    },
    {
      title: '商品物料号',
      dataIndex: 'code'
    },
    {
      title: '商品编码',
      dataIndex: 'Profitcenter'
    },
    {
      title: 'Frame',
      dataIndex: 'Frame'
    },
    {
      title: 'PowerRate',
      dataIndex: 'PowerRate'
    },
    {
      title: 'voltage',
      dataIndex: 'voltage'
    },
    {
      title: '产品组',
      dataIndex: 'product_group'
    },
    {
      title: '商品价格',
      dataIndex: 'price',
      render: price => {
        return '¥' + price
      }
    },
    {
      title: '商品状态',
      render: product => {
        const { _id, status } = product
        const newState = status === 1 ? 2 : 1
        return (
          <span>
            <Button type="primary" onClick={() => updateProductStatus(_id, newState)}>
              {status === 1 ? '下线' : '上架'}
            </Button>
            <span>
              {status === 1 ? '在用' : '已经下架'}
            </span>
          </span>
        )
      }
    },
    {
      title: '操作',
      render: (product) => {
        return (
          <span>
            <LinkButton onClick={() => props.history.push('/sales/product/detail', product)}>详情</LinkButton>
            <LinkButton onClick={() => props.history.push('/sales/product/addupdate', product)}>修改</LinkButton>
          </span>
        )
      }
    }
  ]

  // 请求产品列表数据: 前端分页方式 --> 一次性获取
  // const getProducts = async () => {
  //   setLoading(true)
  //   const result = await reqAllProducts()
  //   setLoading(false)
  //   if (result.status === 0) {
  //     setProducts(result.data)
  //   }
  // }

  // 请求产品列表数据: 后端分页方式 --> 点击页码进行一次ajax查询
  // 获取指定页码的产品列表数据
  // 根据查询条件查询数据
  const getProductsByPage = useCallback(async (pageNum) => {
    let result = null
    pageNumRef.current = pageNum

    setLoading(true)
    // 如果有查询关键字 根据条件查询进行分页
    if (searchText) {
      result = await reqSearchProductListByPage({ pageNum, PAGE_SIZE, searchType, searchText })
    } else {
      // 分页查询所有
      result = await reqProductListByPage(pageNum, PAGE_SIZE)
    }

    setLoading(false)
    // 更新状态数据 total和查询数据结果
    if (result.status === 0) {
      setProducts(result.data.list)
      setTotal(result.data.total)
    } else {
      setProducts(result.data.list)
      setTotal(result.data.total)
    }
  }, [searchType, searchText])

  // 根据产品id更新产品状态
  const updateProductStatus = async (id, status) => {
    const result = await reqUpdateProductStatus(id, status)
    if (result.status === 0) {
      message.success('产品状态更新成功')
      getProductsByPage(pageNumRef.current)
    }
  }

  // 副作用
  useEffect(() => {
    getProductsByPage(1)
  }, [])

  console.log('render...')

  return (
    <Card title={title} extra={extra}>
      <Table
        bordered
        size={"small"}
        loading={loading}
        rowKey="_id"
        dataSource={products}
        columns={columns}
        pagination={{
          current: pageNumRef.current,
          defaultPageSize: PAGE_SIZE,
          showQuickJumper: true,
          total,
          onChange: (page, pageSize) => {
            getProductsByPage(page)
          }
        }}
      />
    </Card>
  )
}
