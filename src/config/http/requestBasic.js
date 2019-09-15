import { USER_INFO_KEY } from '../constants'

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
    return userInfo.token || 'not found token'
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
      console.log(JSON.stringify(res))
      if (res[0]) {
        this.handleError(res[0])
        return res[0]
      } else {
        return res[1].data
      }
    })
  }
  handleError(error) {
    this.messageError(error.errMsg || '发生异常')
  }
}
