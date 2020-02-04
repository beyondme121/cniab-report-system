import React, { useState, useEffect } from 'react'


// 列表
function FruitList(props) {
  const { fruits, setFruit } = props
  return (
    fruits.map(f => (
      <li key={f} onClick={() => setFruit(f)}>{f}</li>
    ))
  )
}

// 添加水果
function FruitAdd(props) {

  // 表单组件, 受控组件, 自己维护自己的状态以及事件
  const [pname, setPname] = useState('')
  const onAddFruit = e => {
    if (e.key === 'Enter') {
      props.onAddFruit(pname)
      setPname('')
    }
  }
  return (
    <div>
      <input
        type="text"
        value={pname}
        onChange={e => setPname(e.target.value)}
        onKeyDown={onAddFruit}
      />
    </div>
  )
}

export default function TestHook() {

  const [fruit, setFruit] = useState('香蕉')
  const [fruits, setFruits] = useState(['苹果', '香蕉'])

  const fruitAdd = (f) => {
    setFruits([...fruits, f])
  }

  // 执行副作用
  // 1. 第二个参数不设置, 只要组件的状态发生变更,就会执行这个useEffect,类似render
  // 2. 如果第二个参数是空数组, 表示只执行一次
  // 3. 通常必须加第二个参数,表示依赖项,只有依赖项数组发生变更才重新渲染执行useEffect
  useEffect(() => {
    console.log('-----------')
    setTimeout(() => {
      setFruits(['a', 'b'])
    }, 1000)
  }, [])

  // 可以写多个副作用, 操作DOM也是副作用
  useEffect(() => {
    document.title = fruit
  }, [fruit])

  return (
    <div>
      <p>{fruit === '' ? '请选择喜爱的水果' : `您选择的是${fruit}`}</p>
      <FruitAdd onAddFruit={fruitAdd} />
      <FruitList fruits={fruits} setFruit={setFruit} />
    </div>
  )
}
