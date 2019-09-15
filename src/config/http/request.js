import HttpBasic from './requestBasic'
import { assign } from 'lodash'
import { ENV } from '../'

export default class HttpRequest extends HttpBasic {
  constructor() {
    super()
  }
  get(url, params, reqOpts, { payload, baseUrl}) {
    const requestParams = assign({}, {
      url: `${baseUrl || ENV.BASE_URL}${url}${payload || ''}`,
      method: 'GET',
      data: params,
    }, reqOpts)
    requestParams.header.Authorization = this.token
    return this.handleResponse(uni.request(requestParams))
  }
  post(url, params, reqOpts, { payload, baseUrl}) {
    const requestParams = assign({}, {
      url: `${baseUrl || ENV.BASE_URL}${url}${payload || ''}`,
      method: 'POST',
      data: params,
    }, reqOpts)
    requestParams.header.Authorization = this.token
    return this.handleResponse(uni.request(requestParams))
  }
  put(url, params, reqOpts, { payload, baseUrl}) {
    const requestParams = assign({}, {
      url: `${baseUrl || ENV.BASE_URL}${url}${payload || ''}`,
      method: 'PUT',
      data: params,
    }, reqOpts)
    requestParams.header.Authorization = this.token
    return this.handleResponse(uni.request(requestParams))
  }
  delete(url, params, reqOpts, { payload, baseUrl}) {
    const requestParams = assign({}, {
      url: `${baseUrl || ENV.BASE_URL}${url}${payload || ''}`,
      method: 'DELETE',
      data: params,
    }, reqOpts)
    requestParams.header.Authorization = this.token
    return this.handleResponse(uni.request(requestParams))
  }

  // 将service上的api挂载到根实例
  registerApi(name, url, options = {}) {
    if (name in this.apiContext) {
			this.messageError(`Duplicated API settings found: ${name}`);
		} else {
			this.apiContext[name] = {
				url,
				...options,
			};
			if (!(name in this)) {
				this[name] = (params, reqOpts, apiOpts) => {
					return this.invoke(name, params, reqOpts, apiOpts).catch(e => {
						throw e;
					});
				};
			}
		}
		return this;
  }
  // 实例触发调用的func
  async invoke(name, params, reqOpts = {}, apiOpts = {}) {
    if (name in this.apiContext) {
      try {
				const meth = this.apiContext[name].method;
        const opts = assign({}, this.config, reqOpts);
        return this[meth](this.apiContext[name].url, params, opts, apiOpts)
			} catch (e) {
				this.messageError(e);
			}
    } else {
			throw new Error(`$api的原型上并不存在${name}方法`);
		}
  }
}
