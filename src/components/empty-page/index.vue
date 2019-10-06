<template>
	<view class="emptyPage">
		<text>{{text}}</text>
	</view>
</template>

<script>
	export default {
    name: 'EmptyPage',
    props: {
      text: {
        type: String,
        default: ''
      }
    }
	}
</script>

<style lang="less" scoped>
.emptyPage {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 32rpx;
  color: @labelColor;
}
</style>
