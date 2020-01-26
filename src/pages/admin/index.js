import React from 'react'
import { Layout } from 'antd'

import LeftNav from '../../components/left-nav'
import MyHeader from '../../components/header'


const { Content, Sider, Footer } = Layout

export default function Admin() {
  return (
    <Layout style={{ height: '100%' }}>
      <MyHeader />
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          {/* <LeftNav /> */}
        </Sider>
        <Content style={{ margin: 10, backgroundColor: 'white' }}>
          Content
          </Content>
        <Footer style={{ textAlign: 'center', color: '#ccc', fontSize: '10px' }}>
          @2020 Beijing ABB Drive system ltd.
          </Footer>
      </Layout>
    </Layout>
  )
}
