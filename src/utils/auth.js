import Cookies from 'js-cookie'
import Config from '@/settings'
/**
 * 该工具类是对 登录token 的 cookie 管理
 */
const TokenKey = Config.TokenKey

/**
 * 从 cookie 中获取 token
 * @returns  token
 */
export function getToken() {
  return Cookies.get(TokenKey)
}

/**
 * 保存 token
 * @param {*} token 登录 token
 * @returns
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

/**
 * 删除 cookie 中的 token 信息
 * @returns
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}
