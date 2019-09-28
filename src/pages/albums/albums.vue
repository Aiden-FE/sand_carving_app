<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
      <uni-grid :column="3">
          <uni-grid-item>
              <text class="text">文本</text>
          </uni-grid-item>
          <uni-grid-item>
              <text class="text">文本</text>
          </uni-grid-item>
          <uni-grid-item>
              <text class="text">文本</text>
          </uni-grid-item>
      </uni-grid>
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
  import {uniGrid,uniGridItem} from '@dcloudio/uni-ui'
	export default {
    components:{uniGrid,uniGridItem},
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

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
