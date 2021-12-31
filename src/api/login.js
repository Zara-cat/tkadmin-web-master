import request from '@/utils/request'

/**
 * 登录api
 * @param username 用户名
 * @param password 密码
 * @param code 验证码
 * @param uuid uuid
 * @returns {AxiosPromise}
 */
export function login(username, password, code, uuid) {
  return request({
    url: 'auth/login',
    method: 'post',
    data: {
      username,
      password,
      code,
      uuid
    }
  })
}

export function getInfo() {
  return request({
    url: 'auth/info',
    method: 'get'
  })
}

/**
 * 获取图片验证码
 * @returns {AxiosPromise}
 */
export function getCodeImg() {
  return request({
    url: 'auth/code',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'auth/logout',
    method: 'delete'
  })
}
