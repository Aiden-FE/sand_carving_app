<template>
	<view class="container">
    <!-- <navigator open-type="switchTab" url="../demo/demo">
      <view>
        跳转路由
      </view>
    </navigator> -->
    <view class="sc-form">
      <form @submit="formSubmit">
        <view class="sc-form-item">
          <text class="sc-form-item-label">用户名称：</text>
          <input class="sc-form-item-input" v-model="form.account" placeholder="请输入用户名称" />
        </view>
        <view class="sc-form-item">
          <text class="sc-form-item-label">用户密码：</text>
          <input class="sc-form-item-input" :password="true" v-model="form.password" placeholder="请输入用户密码" />
        </view>
        <view class="sc-form-item">
          <text class="sc-form-item-label">验证码：</text>
          <input class="sc-form-item-input" :maxlength="4" v-model="form.captcha" placeholder="请输入验证码" />
          <image @click="getCaptchaImg" class="captcha-box" :src="svgCaptcha" />
        </view>
        <view class="sc-form-tips">
          <text @click="switchSignMethod">点击可切换其他登录方式</text>
          <view class="signIcon uni-icon uni-icon-pengyouquan"></view>
        </view>
        <view class="sc-form-buttons">
          <button :style="{
            opacity: submitStatus ? .7 : 1
          }" class="submitBtn" :loading="submitStatus" form-type="submit">登 录</button>
        </view>
      </form>
    </view>
	</view>
</template>

<script>
import debounce from 'lodash/debounce'
import { encodeFunc } from '@/utils'
import { USER_INFO_KEY } from '@/config/constants'

export default {
	data() {
		return {
      form: {
        account: '',
        password: '',
        captcha: ''
      },
      submitStatus: false,
      svgCaptcha: null
		}
	},
	async onLoad() {
    if (uni.getStorageSync(USER_INFO_KEY)) {
      uni.switchTab({
        url: '../home/home'
      })
    } else {
      this.getCaptchaImg();
    }
	},
	methods: {
    // 切换登录方式
    switchSignMethod() {
      this.$common.info('很抱歉,该功能尚未开放!');
    },
    // 获取验证码
    getCaptchaImg: debounce(async function() {
      const res = await this.$api.captcha();
      if (res.status === 200) {
        this.svgCaptcha = 'data:image/png;base64,' + res.data;
      } else this.$common.warning(res.message || '登录失败')
    }, 200),
    // 提交表单
    formSubmit: debounce(async function() {
      if (!this.form.account || !this.form.password || !this.form.captcha) {
        return this.$common.info('请填写提交内容!');
      }
      if (this.form.captcha.length !== 4) {
        return this.$common.info('验证码应为4位');
      }
      const { account, password, captcha } = this.form
      const params = {
        account,
        captcha,
        password: encodeFunc(password)
      }
      this.submitStatus = true;
      const res = await this.$api.sign(params)
      this.submitStatus = false;
      if (res.status === 200) {
        this.$common.success('登录成功')
        // 执行数据存储
        uni.setStorageSync(USER_INFO_KEY, res.data);
        setTimeout(uni.switchTab({
          url: '../demo/demo'
        }), 1600)
      } else {
        console.log('Error: ', res)
        this.$common.warning(res && res.message || '登录失败')
      }
    }, 200)
	}
}
</script>

<style lang="less" scoped>
.captcha-box {
  width: 220rpx;
  height: 40px;
}

.submitBtn {
  color: #fff;
  background: @bgColor;
}

.signIcon {
  font-size: 28rpx;
  color: @tagColor;
}
</style>