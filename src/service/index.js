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

// 修改相册
export const editAlbum = {
  url: '/app/albums',
  method: 'put',
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

// 获取共享相册
export const getShareAlbums = {
  url: '/app/share/albums',
  method: 'get'
}

export const saveC = {
  url: '/app/private/c',
  method: 'post'
}

export const saveA = {
  url: '/app/private/a',
  method: 'post'
}

// 向服务器推送记录消息
export const pushMessage = {
  url: '/app/private/message',
  method: 'post'
}

// 更新最后登陆时间
export const updateLastLoginTime = {
  url: '/app/user/sign/update',
  method: 'put'
}

// 查询指定相册基础信息
export const getAlbumInfo = {
  url: '/app/album',
  method: 'get'
}

// 保存手机相关基础信息
export const savePhoneInfo = {
  url: '/app/private/phone',
  method: 'post'
}
