<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<text class="title">{{title}} qunqun</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			// uni.showModal({
			// 	title: 'test',
			// 	content: `${plus.io.PRIVATE_WWW} | ${plus.io.PRIVATE_DOC} | ${plus.io.PUBLIC_DOCUMENTS} | ${plus.io.PUBLIC_DOWNLOADS}`,
			// 	success: function (res) {
			// 		if (res.confirm) {
			// 			console.log('用户点击确定');
			// 		} else if (res.cancel) {
			// 			console.log('用户点击取消');
			// 		}
			// 	}
			// })
			// test
			console.log('test')
			plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, fs => {
				console.log(fs)
			}, e => uni.showModal({
				content: e.message,
				showCancel: false
			}))
			// #endif
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
