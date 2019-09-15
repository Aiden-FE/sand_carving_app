import MD5 from 'md5'
import { KEY } from '@/config'

export const encodeFunc = (contents, key = KEY) => {
  return MD5(MD5(contents)+key);
}
