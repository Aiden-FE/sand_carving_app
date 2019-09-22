<template>
	<view class="user">
		<view class="user-nav">
      <text>欢迎回来,亲爱的 {{userInfo.name || ''}}</text>
		</view>
    <app-list-item @click="checkUpdate" title="当前版本" icon="arrowright" :content="appInfo.version || ''"></app-list-item>
    <app-list-item @click="$common.info('当前版本尚未开放')" title="设置" icon="arrowright"></app-list-item>
    <button hover-class="user-logout-hover" class="user-logout" @click="confirmLogout">退出登录</button>
	</view>
</template>

<script>
import { logout } from '@/utils'
import { USER_INFO_KEY, APP_INFO_KEY, APP_ID } from '@/config/constants'
import AppListItem from '@/components/app-list-item/index.vue'
import { PLATFORM, ENV } from '@/config'
import { downloadApp } from '@/utils'
import debounce from 'lodash/debounce'

export default {
  components: {
    AppListItem,
  },
	data() {
		return {
      userInfo: {},
      appInfo: {},
		};
	},
  created() {
    this.userInfo = uni.getStorageSync(USER_INFO_KEY);
    this.appInfo = uni.getStorageSync(APP_INFO_KEY);
  },
	methods: {
    checkUpdate: debounce(async function(){
      // #ifdef APP-PLUS
      const res = await this.$api.version({
      	appId: ENV.isDev ? APP_ID : this.appInfo.appid, // 因为在dev环境这个值是Hbuild
      	version: this.appInfo.version
      }, null, {
      	payload: `/${PLATFORM}`
      });
      if (res.status !== 200 || !res.data) return this.$common.error('检查更新失败');
      if (!res.data.isNeedUpdate) return this.$common.success('当前已是最新版本');
      uni.showModal({
      	title: '发布新版本啦',
      	content: res.data.descriptions,
      	showCancel: !res.data.isForce,
      	success: ({confirm}) => {
      	  if (confirm) {
      	    downloadApp(res.data.url, res.data.updateType);
      	  }
      	}
      })
      // #endif
    }, 200),
		confirmLogout() {
			uni.showModal({
				title: '提示',
				content: '您确定退出登录吗?',
				success: ({confirm}) => {
					if (confirm) {
						logout('../login/login')
					}
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
.user {
  height: 100vh;
  background: @pageColor;
	&-nav {
    display: flex;
    margin-bottom: 30rpx;
    align-items: center;
    justify-content: center;
    font-size: 42rpx;
		height: 220px;
		.setImgBg('https://www.agilityjin.top/public/images/userBg.jpg');
	}
  &-logout {
    margin: 30rpx;
    color: #fff;
    background: @bgColor;
    &-hover {
      opacity: .7;
    }
  }
}
</style>
