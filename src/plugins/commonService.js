import Vue from 'vue';

class CommonService {
  info(msg = '') {
    // #ifdef APP-PLUS
    plus.nativeUI.toast(msg, {
      align: 'center',
      duration: 2000,
      // icon: '',iconWidth,iconHeight
    });
    // #endif
  }
  success(msg = '') {
    // #ifdef APP-PLUS
    plus.nativeUI.toast(msg, {
      align: 'center',
      duration: 1500,
      // icon: '',iconWidth,iconHeight
    });
    // #endif
  }
  warning(msg = '') {
    // #ifdef APP-PLUS
    plus.nativeUI.toast(msg, {
      align: 'center',
      duration: 2500,
      // icon: '',iconWidth,iconHeight
    });
    // #endif
  }
  error(msg = '') {
    // #ifdef APP-PLUS
    plus.nativeUI.toast(msg, {
      align: 'center',
      duration: 3000,
      // icon: '',iconWidth,iconHeight
    });
    // #endif
  }
}

const $common = new CommonService();
Vue.prototype.$common = $common;
export default $common;
