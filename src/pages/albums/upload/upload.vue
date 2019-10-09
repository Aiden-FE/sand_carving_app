<template>
	<view class="albumsUpload">
		<view class="sc-form">
      <form @submit="formSubmit">
        <view class="sc-form-item">
          <text class="sc-form-item-label">相册</text>
          <picker :disabled="uploadStatus === 'loading'" class="sc-form-item-input" mode="selector" range-key="name" :range="albums" @change="albumsChange">
            <view>{{form.name || '全部'}}</view>
          </picker>
        </view>
        <view class="sc-form-item">
          <text class="sc-form-item-label">图片上传</text>
          <view @click="selectFiles" class="sc-form-item-input">
            点选后向当前相册上传
          </view>
        </view>
      </form>
      <uni-load-more :contentText="contentText" :status="uploadStatus"></uni-load-more>
    </view>
	</view>
</template>

<script>
  import { USER_INFO_KEY } from '@/config/constants'
  import { uniLoadMore } from '@dcloudio/uni-ui';
  import QiNiu from '@/utils/qiniu.js'
  const qiniu = new QiNiu(); // 创建七牛云相关操作的实例
  
	export default {
    components: {
      uniLoadMore,
    },
		data() {
			return {
        uploadStatus: 'more',
        contentText: {
          contentdown: "",
          contentrefresh: "正在上传中",
          contentnomore: "上传结束"
        },
				form: {
          name: '',
          album: '',
          isPublic: true
        },
        voucher: '',
        userInfo: null,
        albums: []
			};
		},
    created() {
      this.userInfo = uni.getStorageSync(USER_INFO_KEY) || {};
      this.getUserAlbumsList();
      this.getUploadVoucher();
    },
    methods: {
      // 选择文件
      selectFiles() {
        if (this.uploadStatus === 'loading') return this.$common.info('正有图片上传中');
        const config = {
          token: this.voucher,
          userToken: this.userInfo.token,
          album: this.form.album,
          isPublic: this.form.isPublic,
          percent: 0
        }
        const self = this;
        uni.chooseImage({
          count: 9,
          // sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          // sourceType: ['album'], //从相册选择
          success: async function (res) {
            let arr = []
            for (const item of res.tempFilePaths) {
              arr.push({
                fname: qiniu.createFileName(this.userInfo.userId),
                uri: item
              })
            }
            self.uploadStatus = 'loading';
            const resp = await qiniu.uploadFiles(arr, config);
            self.uploadStatus = 'noMore';
            const totalLen = arr.length;
            const successLen = resp.reduce((total, item) => {
              return item.success ? ++total : total
            }, 0)
            const msg = `共选择了${totalLen}个文件,其中${successLen}个文件上传成功,可至 ${self.form.name || '全部'} 相册查看`
            uni.showModal({
              title: '通知',
              content: msg,
              showCancel: false,
              success: ({confirm}) => {
                if(confirm) {
                  uni.navigateBack();
                }
              },
            });
          }
        });
      },
      // 相册改变触发事件
      albumsChange({ detail }) {
        this.form.name = this.albums[detail.value].name
        this.form.album = this.albums[detail.value].id
        this.uploadStatus = 'more';
      },
      // 获取用户相册列表
      async getUserAlbumsList() {
        const res = await this.$api.getAllalbums();
        if (res.status !== 200) return this.$common.error(res.message || '获取用户相册列表失败');
        this.albums = res.data;
        this.albums.unshift({
          id: '',
          name: '全部'
        });
      },
      // 获取上传凭证 key上传文件名,如果是公开上传则不需要传递该值
      async getUploadVoucher(key = '') {
        let params = {
          type: 'upload'
        }
        if(!this.form.isPublic) {
          params.content = key;
          params.isPublic = false;
        }
        const res = await this.$api.getVoucher(params);
        if(res.status === 200) {
          this.voucher = res.data;
        } else this.$common.warning(res.message || '上传凭证获取失败');
      }
    }
	}
</script>

<style lang="less" scoped>

</style>
