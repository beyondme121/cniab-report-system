export default [
  {
    title: 'Dashboard',
    key: '/dashboard',
    icon: 'dashboard',
    public: true,
    children: [
      {
        title: '首页',
        key: '/dashboard/home',
        icon: 'home'
      }
    ]
  },
  {
    title: '销售报表',
    key: '/sales',
    icon: 'appstore',
    children: [
      {
        title: 'Product',
        key: '/sales/product',
        icon: 'bars',
        isParent: 1
      },
      {
        title: 'Region',
        key: '/sales/region',
        icon: 'tool'
      },
      {
        title: 'Industry',
        key: '/sales/industry',
        icon: 'folder'
      },
      {
        title: 'Channel',
        key: '/sales/chanel',
        icon: 'tool'
      }
    ]
  },
  {
    title: '权限管理',
    key: '/permission',
    icon: 'hdd',
    children: [
      {
        title: '用户管理',
        key: '/permission/user',
        icon: 'user',
        children: [
          {
            title: '单用户管理',
            key: '/permission/user/single',
            icon: 'user-add'
          },
          {
            title: '用户组管理',
            key: '/permission/user/group',
            icon: 'usergroup-add'
          }
        ]
      },
      {
        title: '角色管理',
        key: '/permission/role',
        icon: 'control'
      },
      {
        title: '授权管理',
        key: '/permission/authrole',
        icon: 'contacts'
      }
    ]
  },
  {
    title: '需求管理',
    key: '/request',
    icon: 'home',
    children: [
      {
        title: '需求分类',
        key: '/request/category',
        icon: 'copy'
      }
    ]
  }

]