<script>
	import { PLATFORM, ENV } from '@/config'
	import { APP_ID } from '@/config/constants'
	import { downloadApp } from '@/utils'
	export default {
		methods: {
			// 检查更新
			checkUpdate() {
				const _self = this;
				plus.runtime.getProperty(plus.runtime.appid, async function(appInfo) {
					const res = await _self.$api.version({
						appId: ENV.isDev ? APP_ID : appInfo.appid, // 因为在dev环境这个值是Hbuild
						version: appInfo.version
					}, null, {
						payload: `/${PLATFORM}`
					});
					if (res.status !== 200 || !res.data) return; // 异常则静默
					if (!res.data.isNeedUpdate) return;
					uni.showModal({
						title: '发布新版本啦',
						content: res.data.descriptions,
						showCancel: !res.data.isForce,
						success: (result) => {
							downloadApp(res.data.url, res.data.updateType);
						}
					})
				})
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
			this.checkUpdate()
			// #endif
		},
    // app进入前台
		onShow: function() {
			console.log('App Show')
		},
    // app进入后台
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="less">
  /* 引入官方css库 */
  @import './assets/styles/uni.css';
  /* 引入自定义图标库 */
  @import './assets/icon/iconfont.css';
  /* 引入动画库 */
  @import url("animate.css");
  /* 引入项目样式 */
  @import "./assets/styles/index.less";
</style>
