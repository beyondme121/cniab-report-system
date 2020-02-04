import ajax from "./ajax";

let BASE = '/api'
// 请求接口函数, 业务层
export const reqLogin = (username, password) => ajax(BASE + '/user/login', { username, password }, 'POST')


// 获取分类列表
export const reqCategorys = (parentId) => ajax(BASE + '/category/getList', { parentId }, 'GET')

// 添加分类
export const reqAddCategory = ({ parentId, categoryName }) => ajax(BASE + '/category/add', { categoryName, parentId }, 'POST')

// 更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(BASE + '/category/update', { categoryId, categoryName }, 'POST')
