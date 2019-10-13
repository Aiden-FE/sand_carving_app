<template>
	<view>
    <view class="sc-form">
      <form @submit="formSubmit">
        <view class="sc-form-item">
          <text class="sc-form-item-label"><text style="color:red">*</text>名称</text>
          <input v-model="form.name" class="sc-form-item-input" placeholder="请输入相册名称" />
        </view>
        <view class="sc-form-item">
          <text class="sc-form-item-label">描述</text>
          <textarea class="sc-form-item-input" v-model="form.description" auto-height placeholder="请输入相册描述信息" />
        </view>
        <view class="sc-form-item">
          <text class="sc-form-item-label">何人可见</text>
          <view class="sc-form-item-input">
            <view v-for="(item, index) in sharePhone" :key="index" class="sharePhone">
              <input class="sharePhone-input" v-model="item.value" placeholder="请输入对方手机号" />
              <image v-if="index === sharePhone.length - 1 && item.value" @click="addSharePhone" class="form-icon" src="../../../static/images/add.png"></image>
              <image v-if="sharePhone.length > 1" @click="deleteSharePhone(index)" class="form-icon" src="../../../static/images/delete.png"></image>
            </view>
          </view>
        </view>
        <view class="sc-form-buttons">
          <button :style="{
            opacity: submitStatus ? .7 : 1
          }" :loading="submitStatus" class="submitBtn" form-type="submit">立即{{ isEdit ? '修改' : '创建'}}</button>
        </view>
      </form>
    </view>
	</view>
</template>

<script>
  import { phoneNumReg } from '@/utils/patterns.js';
	export default {
		data() {
			return {
        submitStatus: false,
				form: {
          name: '',
          description: '',
          sharePhone: []
        },
        sharePhone: [
          {
            value: '',
          }
        ],
        isEdit: false, // 是否为编辑,
        id: null
			};
		},
    onLoad(opts) {
      this.isEdit = !!opts.id;
      if (this.isEdit) {
        this.getAlbumInfo(opts.id);
        this.id = opts.id;
        uni.setNavigationBarTitle({
          title: '修改相册'
        });
      }
    },
    methods:{
      // 获取相册信息
      async getAlbumInfo(id) {
        const res = await this.$api.getAlbumInfo({
          id
        });
        if (res.status !== 200) return this.$common.error(res.message || '获取相册信息失败');
        this.form.name = res.data.name;
        this.form.description = res.data.description;
        const arr = [];
        for (let item of res.data.sharePhone) {
          arr.push({
            value: item
          })
        }
        if (arr.length > 0) {
          this.sharePhone = arr;
        }
      },
      deleteSharePhone(index) {
        this.sharePhone.splice(index, 1)
      },
      addSharePhone() {
        this.sharePhone.push({ value: '' });
      },
      async formSubmit() {
        if (!this.form.name) return this.$common.warning('请填写相册名称');
        let isOk = true;
        for (const item of this.sharePhone) {
          if (item.value && !phoneNumReg.test(item.value)) {
            isOk = false
          }
        }
        if (!isOk) return this.$common.warning('请检查可见人手机号是否正确')
        // 设置表单sharePhone字段
        for (const item of this.sharePhone) {
          if (item.value) {
            this.form.sharePhone.push(item.value)
          }
        }
        this.submitStatus = true;
        let res;
        if (this.isEdit) {
          res = await this.$api.editAlbum(this.form, null, {
            payload: `/${this.id}`
          })
        } else {
          res = await this.$api.createAlbum(this.form)
        }
        this.submitStatus = false;
        if (res.status === 200) {
          this.$common.success(`${ this.isEdit ? '修改' : '新建' }相册成功`);
          uni.navigateBack();
        } else this.$common.warning(res.message || `${ this.isEdit ? '修改' : '新建' }相册失败`);
      }
    }
	}
</script>

<style lang="less" scoped>
.sharePhone {
  display: flex;
  justify-content: center;
  align-content: center;
  &-input {
    flex: 1;
  }
}
.form-icon {
  width: 40rpx;
  height: 40rpx;
}
.submitBtn {
  color: #fff;
  background: @bgColor;
}
</style>
