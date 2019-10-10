import $common from '@/plugins/commonService';
import { encodeFunc } from '@/utils';

export default class QiNiu {
  uploadUrl = 'https://upload-z2.qiniup.com' // 图片上传地址
  hostPrivate = 'http://pydogipoh.bkt.clouddn.com/'
  hostPublic = 'http://pybmabghq.bkt.clouddn.com/'
  // 生成文件名称
  createFileName(userId, key) {
    const encode = encodeFunc(key || parseInt(Math.random() * 1000000000 + 1), new Date().getTime());
    const str = `${userId}/${encode}`
    return str;
  }
  /**
   * @name 多图片上传方法
   * @param {Blod} filesArr 文件组 包含uri及fname属性
   * @param {Object} config = { // 参数对象
   *   token // 上传凭证
   *   userToken // 用户jwt信息
   *   isPublic // 是否为公开相册
   *   percent // 会被实时更改的当前进度信息
   * }
   * */
  async uploadFiles(filesArr, config) {
    let uploadArr = [];
    for (const item of filesArr) {
      uploadArr.push(this.uploadFile([{
        uri: item.uri
      }], `images/${item.fname}`, config))
    }
    const res = await Promise.all(uploadArr);
    return res
  }
  /**
   * @name 图片上传方法
   * @param {Blod} files 文件路径
   * @param {String} name 需要指定的存储key
   * @param {Object} config = { // 参数对象
   *   token // 上传凭证
   *   userToken // 用户jwt信息
   *   isPublic // 是否为公开相册
   *   percent // 会被实时更改的当前进度信息
   * }
   * */
  uploadFile(files, name, config) {
    console.log('name: ', name)
    return new Promise((resolver, reject) => {
      uni.uploadFile({
        url: this.uploadUrl,
        files,
        header: {
          'Content-Type': 'multipart/form-data'
        },
        formData: {
          token: config.token,
          key: name,
          'x:token': config.userToken,
          'x:url': config.isPublic ? this.hostPublic + name :this.hostPrivate + name,
          'x:album': config.album,
          'x:isPublic': config.isPublic
        },
        success: (res) => {
          switch (res.statusCode){
            case 200:
              resolver({
                success: true,
                message: '上传图片成功'
              })
              break;
            case 401:
            case 403:
              resolver({
                success: false,
                message: '凭证权限异常'
              })
              break;
            default:
              resolver({
                success: false,
                message: '图片上传失败'
              })
              break;
          }
        },
        fail: (err) => {
          resolver({
            success: false,
            message: err && err.message || '资源上传异常'
          })
        },
      })
    })
    
  }
}
