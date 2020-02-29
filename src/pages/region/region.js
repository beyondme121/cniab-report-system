// import React, { useState, userRef, useEffect } from 'react'

// export default function Region() {
//   const [count, setCount] = useState(0)

//   const reactEvent = () => {
//     setCount(c => c + 1)
//     console.log(count)   // 异步
//   }

//   const handleSettimeout = () => {
//     setTimeout(() => {
//       console.log("handleSettimeout,", count)
//       setCount(c => c + 1)
//       console.log("handleSettimeout,", count)
//     }, 1000)
//   }

//   useEffect(() => {
//     setCount(c => c + 100)      // 异步
//     console.log(count)          // 0
//   }, [])

//   return (
//     <div>
//       {count}
//       <div>
//         <button onClick={reactEvent}>React事件触发state</button>
//         <button onClick={handleSettimeout}>定时器触发state</button>
//       </div>
//     </div>
//   )
// }

import React from 'react'
export default class Region extends React.Component {

  state = {
    count: 0,
  }

  /*
   react生命周期勾子中, setState()是异步更新状态
   */
  componentDidMount() {
    console.log('setState()之前', this.state.count)       // 0
    this.setState(state => ({ count: state.count + 1 }))
    console.log('setState()之后', this.state.count)       // 0
  }

  /*
   react事件监听回调中, setState()是异步更新状态
   */
  update1 = () => {
    console.log('setState()之前', this.state.count)           // 1
    this.setState(state => ({ count: state.count + 1 }))
    console.log('setState()之后', this.state.count)         // 1
  }

  /*
  定时器回调 / 原生事件监听回调 / promise回调 /...
   */
  update2 = () => {
    setTimeout(() => {
      console.log('setState()之前', this.state.count)
      this.setState(state => ({ count: state.count + 1 }))
      console.log('setState()之后', this.state.count)
    }, 1000);
  }
  update3 = () => {
    this.refs.count.onclick = () => {
      console.log('setState()之前', this.state.count)
      this.setState(state => ({ count: state.count + 1 }))
      console.log('setState()之后', this.state.count)
    }
  }
  update4 = () => {
    new Promise((resolve, reject) => {
      resolve()
    }).then(() => {
      console.log('setState()之前', this.state.count)
      this.setState(state => ({ count: state.count + 1 }))
      console.log('setState()之后', this.state.count)
    })
  }


  /* 
  2次调用函数方式的setState()
  */
  update5 = () => {
    console.log('setState()之前', this.state.count)
    this.setState(state => ({ count: state.count + 1 }))
    console.log('setState()之后', this.state.count)

    console.log('setState()2之前', this.state.count)
    this.setState(state => ({ count: state.count + 1 }))
    console.log('setState()2之后', this.state.count)
  }

  /*
  2次调用对象方式的setState()
  */
  update6 = () => {
    console.log('setState()之前', this.state.count)
    this.setState({ count: this.state.count + 1 })  // count: 2
    console.log('setState()之后', this.state.count)

    console.log('setState()2之前', this.state.count)
    this.setState({ count: this.state.count + 1 }) // count: 2
    console.log('setState()2之后', this.state.count)
  }

  /*
  先对象方式后函数方式的setState()
  */
  update7 = () => {
    console.log('setState()之前', this.state.count)
    this.setState({ count: this.state.count + 1 })
    console.log('setState()之后', this.state.count)

    console.log('setState2()之前', this.state.count)
    this.setState(state => ({ count: state.count + 1 }))
    console.log('setState()2之后', this.state.count)
  }

  /*
  先函数方式后对象方式的setState()
  */
  update8 = () => {
    console.log('setState()之前', this.state.count)
    this.setState(state => ({ count: state.count + 1 }))
    console.log('setState()之后', this.state.count)

    console.log('setState()2之前', this.state.count)
    this.setState({ count: this.state.count + 1 })
    console.log('setState()2之后', this.state.count)
  }


  render() {
    const { count } = this.state
    console.log('render()', count)
    return (
      <div>
        <h2 ref='count'>{count}</h2>
        <button onClick={this.update1}>更新1</button> ---
        <button onClick={this.update2}>更新2</button> &nbsp;
        <button onClick={this.update3}>更新3</button> &nbsp;
        <button onClick={this.update4}>更新4</button> ---
        <button onClick={this.update5}>更新5</button> &nbsp;
        <button onClick={this.update6}>更新6</button> &nbsp;
        <button onClick={this.update7}>更新7</button> &nbsp;
        <button onClick={this.update8}>更新8</button> &nbsp;
      </div>
    )
  }
}