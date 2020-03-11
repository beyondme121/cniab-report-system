import React from 'react'
import useMousePosition from '../../test/test-hook-selfdefine'
// import TestExport from '../../test/test-export-data'


export default function Home() {
  const position = useMousePosition()
  return (
    <div>
      <div>
        <h1 style={{ fontSize: 10 }}>使用自定义hook,实现函数式组件状态的复用</h1>
      </div>
      <div style={{ fontSize: 10 }}>
        {position.x}, {position.y}
      </div>
      {/* <TestExport /> */}
    </div>
  )
}
