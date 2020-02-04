import React, { useState, useEffect } from 'react'

function PropsTest({ name }) {
  // 依赖项可以是 state或者props, 如果传递的值没有发生变化, 就不请求数据了
  useEffect(() => {
    console.log('********')
  }, [name])

  return (
    <div>
      {name}
    </div>
  )
}


function Example(props) {
  const [count, setCount] = useState(1)
  const [name, setName] = useState('sanfeng')

  // 浏览器渲染DOM之后执行,也就是title会先出现项目中html中的title值CNIAB Reprot,然后再执行这个effect
  useEffect(() => {
    console.log('11111111111')
    document.title = `You clicked ${count}`
    return () => {
      console.log('组件卸载')
    };
  }, [count])

  useEffect(() => {
    console.log('22222222222')
    let timer = setInterval(() => {
      console.log('------')
    }, 1000)
    return () => {
      clearInterval(timer)
      console.log('清楚定时器')
    };
  })

  useEffect(() => {
    console.log('3333333333')
  })

  return (
    <div>
      <p>You clicked {count} times</p>
      <p>{name}</p>
      <button onClick={() => setCount(pre => pre + 100)}>加100</button>
      <button onClick={() => setCount(count + 100)}>加100</button>
      <button onClick={() => setCount(count + 1)}>
        Add 1
      </button>
      <button onClick={() => setName('hello' + count)}>修改名字</button>
      <PropsTest name={name} />
      <ProductPage productId={count} />
    </div>
  );
}


function ProductPage({ productId }) {
  const [product, setProduct] = useState({})
  useEffect(() => {
    // 根据传递的id,返回数据
    const fetchProduct = () => {
      let res = null
      switch (productId) {
        case 1:
          res = {
            name: 'one',
            group: '510'
          }
          break;
        case 2:
          res = {
            name: 'two',
            group: '550'
          }
          break;
        default:
          res = product
          break;
      }
      setProduct(res)
    }

    fetchProduct()
  }, [productId])

  return (
    <div>
      <span>{product.name}</span>
      <span>{product.group}</span>
    </div>
  )
}


export default Example