import { USER_INFO_KEY } from '../constants'
import { logout } from '@/utils'

export default class HttpBasic {
  apiContext = {}

  constructor() {
    this.config = {
      header: {
        'Environment': 'scApp'
      }
    }
  }

  get token() {
    const userInfo = uni.getStorageSync(USER_INFO_KEY) || {}
    return userInfo.token || ''
  }

  messageError(msg = "") {
    uni.showToast({
      title: typeof msg === 'string' ? msg : String(msg),
      duration: 3000,
      image: '../../static/images/warning.png'
    })
  }
  async handleResponse(promise) {
    return promise.then(res => {
      if (res[0]) {
        this.messageError(res[0].errMsg || '请求异常')
        return res[0]
      } else {
        if (res[1].statusCode !== 200) {
          this.handleError(res[1].statusCode);
        } else {
          return res[1].data
        }
      }
    })
  }
  handleError(status) {
    switch (status) {
      case 301:
        this.messageError('请求被转移')
        break;
      case 400:
        this.messageError('请求无效')
        break;
      case 401:
        logout('../../pages/login/login')
        this.messageError('身份认证失败')
        break;
      case 403:
        this.messageError('资源不可用')
        break;
      case 404:
        this.messageError('未找到指定服务')
        break;
      case 405:
        this.messageError('不受支持的请求')
        break;
      case 413:
        this.messageError('资源体积过大')
        break;
      case 500:
        this.messageError('服务内部异常')
        break;
      case 501:
        this.messageError('服务不支持')
        break;
      default:
        this.messageError('服务器异常')
        break;
    }
  }
}
