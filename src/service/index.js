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

// 获取指定相册下的所有图片
export const getAlbumImgList = {
  url: '/app/albums/',
  method: 'get'
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

// 删除相册图片文件
export const removeFiles = {
  url: '/app/delete-all/albums',
  method: 'delete'
}

// 发送注册短信接口
export const sendRegisterSms = {
  url: '/open/sms/register',
  method: 'post'
}

// 用户注册
export const userRegister = {
  url: '/open/user/register',
  method: 'post'
}
