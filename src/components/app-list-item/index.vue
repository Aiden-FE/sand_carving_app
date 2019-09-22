<template>
	<view @click="$emit('click')" hover-class="app-list-item-hover" class="app-list-item">
    <slot class="app-list-item-left" name="left" />
		<text class="app-list-item-title">{{title}}</text>
		<text class="app-list-item-content">{{content}}</text>
    <slot class="app-list-item-right" name="right">
      <view style="color: #666A73;" v-if="icon" class="uni-icon" :class="icon ? `uni-icon-${icon}` : ''" />
    </slot>
	</view>
</template>

<script>
	export default {
		name: 'AppListItem',
    props: {
      title: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: ''
      },
    }
	}
</script>

<style lang="less" scoped>
.app-list-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 15rpx 30rpx;
  background: #fff;
  font-size: 36rpx;
  &-hover {
    background: #f8f8f8;
  }
  &-left, &-right {
  }
  &-title {
    color: @textColor;
  }
   &-content {
    color: @labelColor;
    text-align: right;
    flex: 1;
   }
  &:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 30rpx;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: #f8f8f8;
  }
}
</style>
