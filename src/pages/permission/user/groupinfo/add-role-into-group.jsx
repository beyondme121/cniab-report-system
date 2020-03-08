import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Transfer } from 'antd'
import { reqRoleList } from '../../../../api'

class AddRoleIntoGroup extends Component {

  static propTypes = {
    group: PropTypes.object.isRequired
  }

  state = {
    targetKeys: this.props.group.role_ids,
    roleList: []
  };

  handleChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  getRoleList = async () => {
    const result = await reqRoleList()
    // 穿梭框规定的数据结构格式
    let dataSource = result.data.reduce((pre, item) => {
      pre.push({
        key: item.RoleId,
        title: item.RoleName,
        description: item.RoleDesc
      })
      return pre
    }, [])

    if (result.status === 0) {
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

  componentWillReceiveProps(nextProps) {
    const group = nextProps.group
    this.setState({
      targetKeys: group.role_ids
    })
  }

  componentDidMount() {
    this.getRoleList()
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

export default AddRoleIntoGroup;