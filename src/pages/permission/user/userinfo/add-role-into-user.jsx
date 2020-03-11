import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types'
import { Transfer } from 'antd'
import { reqRoleList, reqGetRoleByUserId } from '../../../../api'

class AddRoleIntoUser extends PureComponent {

  static propTypes = {
    user_id: PropTypes.string.isRequired
  }

  state = {
    targetKeys: [],
    roleList: []
  };

  handleChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  getRoleList = async () => {
    const result = await reqRoleList()
    if (result.status === 0) {
      // 穿梭框规定的数据结构格式
      let dataSource = result.data.reduce((pre, item) => {
        pre.push({
          key: item.RoleId,
          title: item.RoleName,
          description: item.RoleDesc
        })
        return pre
      }, [])
      this.setState({
        roleList: dataSource
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

  // 获取某个用户的角色列表
  getRoleListByUserId = async user_id => {
    const result = await reqGetRoleByUserId(user_id)
    if (result.status === 0) {
      this.setState({
        targetKeys: result.data.role_ids
      })
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   const user_id = nextProps.user_id
  //   this.getRoleListByUserId(user_id)
  // }

  // 测试替换componentWillReceiveProps
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("this.props.user_id: ", this.props.user_id)
    console.log("prevProps.user_id: ", prevProps.user_id)
    if (this.props.user_id !== prevProps.user_id) {
      console.log("componentDidUpdate")
      const user_id = this.props.user_id
      this.getRoleListByUserId(user_id)
    }
  }

  componentDidMount() {
    this.getRoleList()
    this.getRoleListByUserId(this.props.user_id)
  }

  render() {
    const { targetKeys, roleList } = this.state;
    return (
      <div>
        <Transfer
          dataSource={roleList}
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
          render={item => `${item.title}`}
        />
      </div>
    );
  }
}

export default AddRoleIntoUser;