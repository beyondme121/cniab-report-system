import React from 'react'
import { withRouter } from 'react-router-dom'

import { Empty, Button } from 'antd'

function NotFound(props) {
  return (
    <div>
      <Empty description="您查找的页面不存在" />
      <Button onClick={() => props.history.replace('/')}>跳转</Button>
    </div>
  )
}

export default withRouter(NotFound)
