import React, { Component } from 'react';
import { Transfer } from 'antd'
import { reqUserList } from '../../../../api'

class AddUsersIntoGroup extends Component {
  state = {
    targetKeys: [],
    userList: []
  };

  handleChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  getUserList = async () => {
    const result = await reqUserList()
    // 穿梭框规定的数据结构格式
    let dataSource = result.data.reduce((pre, item) => {
      pre.push({
        key: item.user_id,
        title: item.user_name,
        description: item.email
      })
      return pre
    }, [])

    if (result.status === 0) {
      this.setState({
        userList: dataSource
      })
    }
  }

  // 父级调用: 获取子组件中的targetKeys
  getTargetKeys = () => {
    return this.state.targetKeys
  }

  // 父级调用: 清空穿梭框的targetKeys
  setTargetKeys = () => {
    this.setState({
      targetKeys: []
    })
  }

  componentWillReceiveProps(nextProps) {
    const group = nextProps.group
    console.log("add-user-into-group: group: ", group)
    // this.setState({
    //   checkedKeys: menus
    // })
  }

  componentDidMount() {
    this.getUserList()
  }

  render() {
    const { targetKeys, userList } = this.state;
    return (
      <div>
        <Transfer
          dataSource={userList}
          titles={['未选中', '已选中']}
          // 定义每个穿梭框的宽高
          listStyle={{
            width: 340,
            height: 500,
          }}
          showSearch
          showSelectAll
          // 定义整体穿梭框的样式
          style={{ marginLeft: 20 }}
          targetKeys={targetKeys}
          onChange={this.handleChange}
          render={item => `${item.title} - ${item.description}`}
        />
      </div>
    );
  }
}

export default AddUsersIntoGroup;