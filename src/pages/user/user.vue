<template>
	<view @click="confirmLogout">
		我的页面
	</view>
</template>

<script>
import { logout } from '@/utils'
export default {
	data() {
		return {
		};
	},
	methods: {
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

<style lang="less">

</style>
