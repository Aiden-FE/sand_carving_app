<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
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
