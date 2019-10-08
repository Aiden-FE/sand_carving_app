<template>
	<view>
		<view class="sc-form">
      <form @submit="sendCaptcha">
        <view class="sc-form-item">
          <text class="sc-form-item-label">
            <text style="color:red">*</text>手机号
          </text>
          <input type="number" v-model="form.phone" class="sc-form-item-input" placeholder="请输入注册手机号" />
        </view>
        <view class="sc-form-item">
          <text class="sc-form-item-label">
            <text style="color:red">*</text>登录密码
          </text>
          <input class="sc-form-item-input" :password="true" v-model="form.password" placeholder="请输入登录密码" />
        </view>
        <view class="sc-form-item">
          <text class="sc-form-item-label">
            <text style="color:red">*</text>昵称
          </text>
          <input class="sc-form-item-input" v-model="form.name" placeholder="我们该如何称呼您" />
        </view>
        <view class="sc-form-item">
          <text class="sc-form-item-label">
            <text style="color:red">*</text>性别
          </text>
          <radio-group class="sc-form-item-input" @change="sexChange">
            <label style="margin-right: 25rpx" for="nan">
              <radio id="nan" value="男" :checked="form.sex === '男'" />
              <text>男</text>
            </label>
            <label for="nv">
              <radio id="nv" value="女" :checked="form.sex === '女'" />
              <text>女</text>
            </label>
          </radio-group>
        </view>
        <view class="sc-form-item">
          <text class="sc-form-item-label">
            登录账户
          </text>
          <input class="sc-form-item-input" v-model="form.account" placeholder="如不填写则默认为手机号" />
        </view>
        <view class="sc-form-item">
          <text class="sc-form-item-label">
            真实姓名
          </text>
          <input class="sc-form-item-input" v-model="form.userName" placeholder="您的真实姓名" />
        </view>
        <view class="sc-form-item">
          <text class="sc-form-item-label">
            邮箱
          </text>
          <input class="sc-form-item-input" v-model="form.email" placeholder="用于接收通知的邮箱" />
        </view>
        <view class="sc-form-buttons">
          <button :disabled="limitStatus" :style="{
            opacity: submitStatus ? .7 : 1
          }" class="sc-form-submit" :loading="submitStatus" form-type="submit">{{limitStatus ? `${limitTime}s后可再次申请注册` : '立即注册' }}</button>
        </view>
      </form>
    </view>
    
    <!-- 验证码弹窗 -->
    <uni-popup :maskClick="false" :show="popupShow" class="captcha" type="center">
      <icon @click="closeCaptcha" class="captcha-close" type="cancel" size="26"/>
      <view class="captcha-title">请输入短信验证码</view>
      <text class="captcha-tips">验证码已发送至{{form.phone}}, 请在下方输入四位数字验证码,验证码五分钟内有效</text>
      <wakary-input v-if="popupShow" @finish="registerUser" type="bottom"></wakary-input>
    </uni-popup>
	</view>
</template>

<script>
  import { uniPopup } from '@dcloudio/uni-ui';
  import WakaryInput from '@/components/wakary-input/wakary-input.vue';
  import { phoneNumReg, passWordReg, userNameReg, realNameReg, emailReg } from '@/utils/patterns.js';
  import { USER_INFO_KEY } from '@/config/constants'
	export default {
    components: {
      uniPopup,
      WakaryInput
    },
		data() {
			return {
        popupShow: false,
        limitTime: '',
        submitStatus: false,
				form: {
          phone: '', // *唯一手机号码
          password: '', // *登录密码
          sex: '男', // *性别
          name: '', // *昵称
          account: '', // *普通登录账户,不设置则默认为手机号
          captcha: '',
          userName: '', // 真实姓名
          email: '' // 邮箱
        }
			};
		},
    computed: {
      limitStatus() {
        return this.limitTime > 0
      }
    },
    methods: {
      // 短信倒计时设置
      setLimitTime() {
        this.limitTime = 60;
        const self = this;
        const timer = setInterval(() => {
          self.limitTime = --self.limitTime
          if (self.limitTime < 1) {
            clearInterval(timer)
            self.limitTime = '';
          }
        }, 1000)
      },
      sexChange(event) {
        this.form.sex = event.target.value
      },
      // 用户注册
      async registerUser() {
        // userRegister
        const res = await this.$api.userRegister(this.form)
        if (res.status === 200) {
          this.$common.success('注册成功')
          // 执行数据存储
          uni.setStorageSync(USER_INFO_KEY, res.data);
          setTimeout(uni.switchTab({
            url: '../albums/albums'
          }), 1600)
        } else {
          this.popupShow = false;
          uni.showModal({
            title: '提示',
            content: res.message || '注册失败',
            showCancel: false,
          });
        }
      },
      // 关闭验证码弹层
      closeCaptcha() {
        uni.showModal({
          title: '提示',
          content: '您确定关闭吗?验证码在一分钟内不可重复发送!',
          success: ({confirm}) => {
            if (confirm) {
              this.popupShow = false;
            }
          },
        });
      },
      // 发送验证码
      async sendCaptcha() {
        if (!this.form.phone || !phoneNumReg.test(this.form.phone)) return this.$common.warning('请输入正确的手机号');
        if (!this.form.password || !passWordReg.test(this.form.password)) return this.$common.warning('请提供6-16位由字母及数字组成的密码');
        if (!this.form.password || !passWordReg.test(this.form.password)) return this.$common.warning('请提供6-16位由字母及数字组成的密码');
        if (!this.form.name || this.form.name.length < 2 || this.form.name.length > 12) return this.$common.warning('请提供2-12位的昵称');
        if (this.form.userName && !realNameReg.test(this.form.userName)) return this.$common.warning('请填写真实的用户姓名');
        if (this.form.email && !emailReg.test(this.form.email)) return this.$common.warning('请填写正确的邮箱地址');
        // 调用发送验证码接口,成功后执行下面的逻辑
        const res = await this.$api.sendRegisterSms({
          phone: this.form.phone
        })
        if (res.status !== 200) return this.$common.warning(res.message || '短信发送失败')
        this.$common.success('短信发送成功');
        this.setLimitTime();
        this.popupShow = true;
      }
    }
	}
</script>

<style lang="less" scoped>
.captcha {
  &-close {
    position: absolute;
    right: 5rpx;
    top: 5rpx;
  }
  &-title {
    padding: 0 50rpx;
    font-size: 38rpx;
    color: @labelColor;
  }
  &-tips {
    padding: 0 50rpx;
    font-size: 28rpx;
    color: @tipsColor;
  }
}
</style>
