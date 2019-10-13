<template>
	<view class="imagesList">
    <view class="albumsList">
      <image @longpress="openImagePanel(item)" @click="previewImages(item.url)" v-for="item in imagesList" :key="item.uid" class="albumsList-img" :lazy-load="true" :src="item.coverImgUrl || ALBUMS_DEFAULT_IMG" mode="scaleToFill"></image>
    </view>
    <empty-page v-if="imagesList.length === 0" text="尚未上传照片"></empty-page>
    
    <uni-popup @change="imagePanelChange" :show="imageManager" type="bottom">
      <view @click="removeImage(imageData)" style="color: red" hover-class="manager-text-hover" class="manager-text">
        删除
      </view>
    </uni-popup>
	</view>
</template>

<script>
  import { ALBUMS_DEFAULT_IMG } from '@/config';
  import EmptyPage from '@/components/empty-page/index.vue';
  import { USER_INFO_KEY } from '@/config/constants'
  import { uniPopup } from '@dcloudio/uni-ui';
	export default {
    components: {
      EmptyPage,
      uniPopup
    },
		data() {
			return {
				id: null,
        userId: null,
        userInfo: null,
        isOtherId: false, // 是否为其他的相册
        imagesList: [],
        previewList: [],
        ALBUMS_DEFAULT_IMG,
        imageManager: false,
        imageData: null,
			};
		},
    onLoad(params) {
      this.id = params.id;
      this.userId = params.userId
      this.userInfo = uni.getStorageSync(USER_INFO_KEY)
      this.isOtherId = this.userInfo.userId !== this.userId;
      uni.setNavigationBarTitle({
        title: params.name || '相册'
      });
      this.getAlbumImgList();
    },
    methods: {
      resetPanelData() {
        this.imageManager = false;
        this.imageData = null;
      },
      imagePanelChange({show}) {
        if (!show) {
          this.resetPanelData();
        }
      },
      openImagePanel(item) {
        this.imageData = item;
        this.imageManager = true;
      },
      // 保存图片
      saveImage(item) {
        const self = this;
        uni.downloadFile({
          url: item.url,
          success: res => {
            if (res.statusCode === 200) {
              uni.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: resp => {
                  self.$common.success('已保存至系统相册');
                },
                fail: err => self.$common.warning('文件保存失败')
              })
            } else self.$common.warning(res.errMsg || '文件保存失败')
          }
        })
      },
      // 删除图片
      async removeImage(item, index) {
        const params = {
          name: item.name,
          isPublic: item.isPublic,
          uid: item.uid
        }
        const res = await this.$api.removeFiles({
          fileList: [params]
        })
        if (res.status !== 200) return this.$common.warning(res.message || '图片删除失败');
        this.getAlbumImgList();
        this.$common.success('图片删除成功');
        this.resetPanelData();
      },
      // 预览图片
      previewImages(url) {
        const self = this;
        uni.previewImage({
          current: url,
          urls: this.previewList,
          loop: true,
          longPressActions: {
            itemList: self.isOtherId ? ['保存图片'] : ['保存图片', '删除'],
            success: function(data) {
              switch (data.tapIndex){
                case 0:
                  self.saveImage(self.imagesList[data.index])
                  break;
                case 1:
                  self.removeImage(self.imagesList[data.index], data.index)
                  break;
                default:
                  break;
              }
            },
          }
        })
      },
      // 获取相册图片列表
      async getAlbumImgList() {
        const res = await this.$api.getAlbumImgList({
          userId: this.userId
        }, null, {
          payload: this.id
        });
        if (res.status !== 200) return this.$common.error(res.message || '获取相册下所有图片失败');
        this.imagesList = res.data;
        this.previewList = [];
        for (const item of this.imagesList) {
          this.previewList.push(item.url);
        }
      }
    }
	}
</script>

<style lang="less" scoped>
  .manager-text {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15rpx 30rpx;
    background: #fff;
    font-size: 36rpx;
    &-hover {
      background: #f8f8f8;
    }
  }
  .manager-line:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 30rpx;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: @pageColor;
  }
.albumsList {
  display: flex;
  padding: 4rpx;
  align-items: center;
  flex-wrap: wrap;
  overflow-y: auto;
  &-img {
    margin-left: 4rpx;
    margin-bottom: 4rpx;
    width: 24.4%;
    height: 180rpx;
  }
}
</style>
