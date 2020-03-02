import ajax from "./ajax";

let BASE = '/api'
// 请求接口函数, 业务层
export const reqLogin = (username, password) => ajax(BASE + '/user/login', { username, password }, 'POST')

export const reqLoginToken = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

// ----------------- 商品分类 -----------------
// 获取分类列表
export const reqCategorys = (parentId) => ajax(BASE + '/category/getList', { parentId }, 'GET')

// 添加分类
export const reqAddCategory = ({ parentId, categoryName }) => ajax(BASE + '/category/add', { categoryName, parentId }, 'POST')

// 更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(BASE + '/category/update', { categoryId, categoryName }, 'POST')



// ----------------- 产品相关接口 -----------------
// 1. 一次性请求所有数据 --> 前台分页 使用场景: 数据量不大的数据
export const reqAllProducts = () => ajax(BASE + '/product/get-products')

// 2. 后台分页
export const reqProductListByPage = (pageNum, pageSize) => ajax(BASE + '/product/listbypage', { pageNum, pageSize })

// 3. 根据关键字查询
export const reqSearchProductListByPage = ({ pageNum, PAGE_SIZE, searchType, searchText }) => {
  return ajax(BASE + '/product/getListBySearch', {
    pageNum,
    pageSize: PAGE_SIZE,
    [searchType]: searchText
  })
}

// 4. 根据产品小pc查询产品的所属的各个层级 通过数据库冗余
export const reqProductHierachyByPC = Profitcenter => ajax(BASE + '/product/getProductHierachy', { Profitcenter })

// 5. 根据产品id更新产品状态
export const reqUpdateProductStatus = (id, status) => ajax(BASE + '/product/update', { id, status }, 'POST')




// 角色管理
export const reqRoleList = () => ajax(BASE + '/role')
export const reqAddRole = (role) => ajax(BASE + '/role', role, 'POST')
export const reqUpdateRoleWithPermission = role => ajax(BASE + '/role/update', role, 'POST')

// 菜单管理
export const reqMenuList = () => ajax(BASE + '/permission/menu')
export const reqAddMenu = (value) => ajax(BASE + '/permission/menu', value, 'POST')
export const reqIcons = () => ajax(BASE + '/permission/menu/icons')