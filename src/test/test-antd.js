import React from 'react'
import { Row, Col } from 'antd'


const gutterBox = {
  background: 'transparent',
  border: '1px solid red'
}

export default function TestAntd() {
  return (
    <div className='gutter-example'>
      <Row gutter={60} type="flex" justify="center" align="bottom">
        <Col className="gutter-row" span={3}>
          <div style={{ height: '40px', lineHeight: '40px', border: '1px solid red', textAlign: 'center' }}>col-6</div>
        </Col>
        <Col className="gutter-row" span={3}>
          <div style={gutterBox}>col-6</div>
        </Col>
        <Col className="gutter-row" span={3}>
          <div style={gutterBox}>col-6</div>
        </Col>
        <Col className="gutter-row" span={3}>
          <div style={gutterBox}>col-6</div>
        </Col>
      </Row>
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">col-6</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">col-6</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">col-6</div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">col-6</div>
        </Col>
      </Row>
    </div>
  )
}
