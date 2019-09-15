export const KEY = "Agility";

// 运行时环境
export const PLATFORM = uni.getSystemInfoSync().platform

const devEnv = {}
const prodEnv = {}

// #ifdef APP-PLUS
devEnv.BASE_URL = 'http://127.0.0.1:7001';
prodEnv.BASE_URL = 'https://www.agilityjin.top:7001/api';
// #endif

// #ifdef H5
devEnv.BASE_URL = '/api';
prodEnv.BASE_URL = '/api';
// #endif

// 环境变量
export const ENV = process.env.NODE_ENV === 'development' ? devEnv : prodEnv
