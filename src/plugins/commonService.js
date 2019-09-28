import Vue from 'vue';

class CommonService {
  info(msg = '') {
    // #ifdef APP-PLUS
    plus.nativeUI.toast(msg, {
      align: 'center',
      duration: 2000,
    });
    // #endif
  }
  success(msg = '') {
    // #ifdef APP-PLUS
    plus.nativeUI.toast(msg, {
      align: 'center',
      duration: 1500,
    });
    // #endif
  }
  warning(msg = '') {
    // #ifdef APP-PLUS
    plus.nativeUI.toast(msg, {
      align: 'center',
      duration: 2500,
    });
    // #endif
  }
  error(msg = '') {
    // #ifdef APP-PLUS
    plus.nativeUI.toast(msg, {
      align: 'center',
      duration: 3000,
    });
    // #endif
  }
}

const $common = new CommonService();
Vue.prototype.$common = $common;
export default $common;
