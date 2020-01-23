import React from 'react'
import { connect } from 'react-redux'
import { increment } from '../redux/actions'
import { Button } from 'antd'

function ReduxTest(props) {
  function handleAdd(num) {
    props.increment(num)
  }
  return (
    <div className="App">
      <Button type="primary" onClick={() => handleAdd(5)}>加5</Button>
      <p>{props.counter}</p>
      <p>{props.user.name}</p>
    </div>
  )
}


const mapStateToProps = state => ({
  counter: state.counter,
  user: state.user
})

const mapDispatchToProps = {
  increment
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxTest)
