// 验证码接口
export const captcha = {
  url: '/open/user/captcha',
  method: 'get'
}

// 登录接口
export const sign = {
  url: '/open/user/sign',
  method: 'post'
}

// 检查更新接口
export const version = {
  url: '/open/versions',
  method: 'get'
}

// 得到当前用户下所有相册列表
export const getAllalbums = {
  url: '/app/albums',
  method: 'get',
}

// 新增相册
export const createAlbum = {
  url: '/app/albums',
  method: 'post',
}

// 删除相册
export const deleteAlbum = {
  url: '/app/albums',
  method: 'delete',
}

// 获取上传或下载凭证
export const getVoucher = {
  url: '/common/voucher/getVoucher',
  method: 'post'
}
