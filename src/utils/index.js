import $common from '@/plugins'
import MD5 from 'md5'
import { KEY } from '@/config'
import { USER_INFO_KEY } from '@/config/constants'

export const logout = pageUrl => {
  uni.removeStorageSync(USER_INFO_KEY)
  uni.reLaunch({
    url: pageUrl
  })
}

export const encodeFunc = (contents, key = KEY) => {
  return MD5(MD5(contents)+key);
}

/**
 * @name app下载方法
 * @param {String} url 下载链接
 * @param {String} updateType hot/all 热更新或整包更新
 */
export const downloadApp = (url, updateType) => {
  if (updateType === 'hot') {
    hotUpdateApp(url);
  } else {
    plus.runtime.openURL(url);
  }
}

/**
 * @name 热更新app方法
 * @param {String} url 热更新下载地址
 */
export const hotUpdateApp = url => {
  uni.downloadFile({
    url,
    success: downloadResult => {
      if (downloadResult.statusCode === 200) {  
        plus.runtime.install(downloadResult.tempFilePath, {  
          force: false // 版本号校验,不高于当前版本号则不安装
        }, () => {
          uni.showModal({
            title: '发布新版本啦',
            content: '更新完成,请确认重新启动应用',
            showCancel: false,
            success: ({confirm}) => {
              if (confirm) {
                plus.runtime.restart();
              }
            }
          })
        }, e => {
          console.error(e)
          $common.error('在线更新失败')
        });  
      }
    },
    fail: err => {
      console.error(err)
      $common.error('在线更新失败')
    }
  })
}