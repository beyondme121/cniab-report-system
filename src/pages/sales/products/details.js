import React, { useState, useEffect } from 'react'
import {
  Card,
  Icon,
  List,
} from 'antd'
import LinkButton from '../../../components/link-button'
import { reqProductHierachyByPC } from '../../../api'
const Item = List.Item



export default function Details(props) {

  const [ProductGroupText, setProductGroupText] = useState('')
  const [PGShortName, setPGShortName] = useState('')
  const { name, code, Profitcenter, Frame, product_group, price, status, createtime } = props.location.state


  const title = (
    <div className="product-detail-title">
      <LinkButton onClick={() => props.history.goBack()}>
        <Icon type="arrow-left" style={{ marginRight: 5, fontSize: 20 }} />
      </LinkButton>
      <span>商品详情</span>
    </div>
  )

  useEffect(() => {
    async function fetchData() {
      // 通过产品的小pc查询产品分类名称 多级分类
      const { status, data } = await reqProductHierachyByPC(Profitcenter)
      let { ProductGroupText: _ProductGroupText, PGShortName: _PGShortName } = data[0]
      if (status === 0) {
        setProductGroupText(_ProductGroupText)
        setPGShortName(_PGShortName)
      }
    }
    fetchData();
  }, [Profitcenter]);

  return (
    <Card title={title} className="product-detail">
      <List>
        <Item>
          <span>产品名称</span>
          <span>{name}</span>
        </Item>
        <Item>
          <span>产品编码</span>
          <span>{code}</span>
        </Item>
        <Item>
          <span>规则</span>
          <span>{Frame}</span>
        </Item>
        <Item>
          <span>所属分类</span>
          <span>{PGShortName} -> {ProductGroupText}</span>
        </Item>
        <Item>
          <span>价格</span>
          <span>{"¥" + price}</span>
        </Item>
        <Item>
          <span>产品状态</span>
          <span>{status === 1 ? '可下单' : '无货'}</span>
        </Item>
        <Item>
          <span>产品组</span>
          <span>{product_group}</span>
        </Item>
        <Item>
          <span>创建时间</span>
          <span>{createtime}</span>
        </Item>
      </List>
    </Card>
  )
}
