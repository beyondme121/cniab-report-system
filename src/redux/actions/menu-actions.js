import { SAVE_MENU } from "../action-types";
import { reqMenuList } from '../../api'
import { message } from 'antd'
// 同步的actions
export const save_menu = (menus) => ({
  type: SAVE_MENU,
  data: menus
})

// 异步的actions
export const getMenuList = () => {
  return async dispatch => {
    const result = await reqMenuList()
    console.log("menu result: ", result.data)
    if (result.status === 0) {
      dispatch(save_menu(result.data))
    } else {
      message.warning('获取菜单失败')
    }
  }
}