import React, { Component } from 'react'
import { Card, Button, Table, Modal, Row, Col, Input, Icon, message } from 'antd'
import Highlighter from 'react-highlight-words';
import {
  reqUserList,
  reqDeleteUsers,
} from '../../../../api'
import dayjs from 'dayjs'
import { PAGE_SIZE } from '../../../../config/constants'

export default class UserHome extends Component {
  state = {
    users: [],
    selectedRowKeys: [],
    searchText: '',
    searchedColumn: '',
  }

  // ------------------- 处理表单字段查询的回调 start-------------------
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase())
    },

    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
  // ------------------- 处理表单字段查询的回调 end-------------------


  // ------------------- 选中某一行或某几行记录的回调(用户收集选中项的user_id) start -------------------
  // 点击复选框的回调
  onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys, ", selectedRowKeys)
    this.setState({ selectedRowKeys })
  }
  // 点击记录行的回调
  // onRow = (record) => {
  //   return {
  //     onClick: e => {     // 点击行
  //       this.setState((state) => {
  //         return {
  //           selectedRowKeys: [...state.selectedRowKeys, record.user_id]
  //         }
  //       }, () => {
  //         console.log("onRow:", this.state.selectedRowKeys)
  //       })
  //     },
  //   };
  // }
  // ------------------- 选中某一行或某几行记录的回调(用户收集选中项的user_id) end -------------------

  // ------------------- 请求后端数据 start -------------------
  // 1. 请求用户列表
  getUserList = async () => {
    const result = await reqUserList()
    if (result.status === 0) {
      this.setState({
        users: result.data
      })
    } else {
      message.warning(result.msg)
    }
  }

  // 2. 删除用户
  deleteUsers = async delete_user_ids => {
    const result = await reqDeleteUsers(delete_user_ids)
    if (result.status === 0) {
      // 使用数组的方式更新状态, 没有再重新发送一次请求
      let newUsers = this.state.users
      for (let i = 0; i < newUsers.length; i++) {
        for (let j = 0; j < delete_user_ids.length; j++) {
          if (newUsers[i].user_id === delete_user_ids[j]) {
            newUsers.splice(i, 1)
          }
        }
      }
      this.setState({
        users: newUsers,
        selectedRowKeys: []     // 清空之前已经选中的选项,否则会保存之前所有的选中项
      })
      message.success(result.msg)
    } else {
      message.error(result.msg)
    }
  }


  componentDidMount() {
    this.getUserList()
  }

  render() {
    const { users, selectedRowKeys } = this.state

    const columns = [
      {
        title: '用户名',
        dataIndex: 'user_name',
        key: 'user_name',
        // className: 'hello',
        ...this.getColumnSearchProps('user_name')
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        ...this.getColumnSearchProps('email')
      },
      {
        title: '用户短名',
        dataIndex: 'ad_account'
      },
      {
        title: '电话',
        dataIndex: 'phone_no',
        ...this.getColumnSearchProps('phone_no')
      },
      {
        title: '注册日期',
        dataIndex: 'createtime',
        render: createtime => {
          return dayjs(createtime).format('YYYY-MM-DD HH:mm')
        }
      },
      {
        title: '首次登录日期',
        dataIndex: 'first_login_time'
      },
      {
        title: '最近一次登录日期',
        dataIndex: 'last_login_time'
      },
      {
        title: '登录次数',
        dataIndex: 'login_count'
      },
    ]
    // 增删改查按钮的样式, 未选中 删除 授权等按钮不可用
    const btnStyle = {
      disabled: selectedRowKeys.length > 0 ? false : true
    }
    // 多选框的样式以及回调函数的定义
    const rowSelection = {
      columnWidth: 20,
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const title = (
      <Row gutter={[10]}>
        <Col span={2}>
          <Button type="primary" onClick={() => this.props.history.push('/permission/user/single/addupdate')}>
            创建用户
          </Button>
        </Col>
        <Col span={2}>
          <Button type="primary" disabled={true} onClick={
            () => this.props.history.push('/permission/user/single/addupdate')}>
            修改用户
          </Button>
        </Col>
        <Col span={2}>
          <Button type="primary" {...btnStyle} onClick={() => { this.deleteUsers(selectedRowKeys) }}>
            删除用户
          </Button>
        </Col>
        <Col span={2}>
          <Button type="primary" {...btnStyle} onClick={() => { }}>
            设置角色
          </Button>
        </Col>
        <Col span={2}>
          <Button type="primary" {...btnStyle} onClick={() => { }}>
            设置用户组
          </Button>
        </Col>
      </Row>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          rowSelection={rowSelection}
          // onRow={this.onRow}
          size="small"
          rowKey="user_id"
          dataSource={users}
          columns={columns}
          pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
        />
      </Card>
    )
  }
}
