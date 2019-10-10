export const KEY = "Agility";

export const ALBUMS_DEFAULT_IMG = "http://pybmabghq.bkt.clouddn.com/images/empty.jpg"; // 相册默认图片地址

// 运行时环境
export const PLATFORM = uni.getSystemInfoSync().platform

const devEnv = {
  isDev: true
}
const prodEnv = {
  isDev: false
}

// #ifdef APP-PLUS
devEnv.BASE_URL = 'http://192.168.1.2:7001'; // app开发时此地址必须为手机端或者模拟器能够访问到的ip地址
prodEnv.BASE_URL = 'https://www.agilityjin.top/api';
// #endif

// #ifdef H5
devEnv.BASE_URL = '/api';
prodEnv.BASE_URL = '/api';
// #endif

// 环境变量
export const ENV = process.env.NODE_ENV === 'development' ? devEnv : prodEnv
