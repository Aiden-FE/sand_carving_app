<template>
  <view class="albums">
    <uni-grid :show-border="false" :column="3">
      <uni-grid-item :class="isShowDelete && item.id !== 'all' ? 'swing' : ''" class="albums-item animated infinite slower" v-for="item in albumsList" :key="item.id">
        <image @click="ablumEntry(item.id, item.name)" @longpress="isShowDelete = !isShowDelete" class="albums-img" :lazy-load="true" :src="item.coverImgUrl || ALBUMS_DEFAULT_IMG" mode="center"></image>
        <view class="albums-name">{{ item.name }}</view>
        <view class="albums-tips">{{ item.count }}</view>
        <icon v-if="isShowDelete && item.id !== 'all'" @click="deleteAlbum(item)" class="album-delete-button" type="cancel" size="26" />
      </uni-grid-item>
    </uni-grid>
    <uniFab ref="uniFab" direction="vertical" horizontal="right" @trigger="trigger" :content="content" :pattern="pattern"></uniFab>
  </view>
</template>

<script>
import { uniGrid, uniGridItem, uniFab } from '@dcloudio/uni-ui';
import { ALBUMS_DEFAULT_IMG } from '@/config';
export default {
  components: { uniGrid, uniGridItem, uniFab },
  data() {
    return {
      isShowDelete: false,
      pattern: {
        color: '#333',
        backgroundColor: '#fff',
        buttonColor: '#00B9B2'
      },
      content: [
        {
          iconPath: '../../static/images/albums.png',
          text: '新建相册',
          active: false,
          value: 'create'
        },
        {
          iconPath: '../../static/images/albums.png',
          text: '上传图片',
          active: false,
          value: 'upload'
        }
      ],
      albumsList: [],
      ALBUMS_DEFAULT_IMG
    };
  },
  onShow() {
    this.getUserAlbumsList();
  },
  async onPullDownRefresh() {
    await this.getUserAlbumsList();
    uni.stopPullDownRefresh();
  },
  methods: {
    ablumEntry(id, name) {
      uni.navigateTo({
          url: `./list/list?id=${id}&name=${name}`
      });
    },
    deleteAlbum(item) {
      uni.showModal({
        title: '提示',
        content: `您确定要删除相册 ${item.name} 及该相册内所有图片吗?`,
        success: async opts => {
          if (opts.confirm) {
            // 执行删除
            const res = await this.$api.deleteAlbum(undefined, null, { payload: '/' + item.id });
            if (res.status === 200) {
              this.$common.success('删除相册成功');
              this.isShowDelete = false;
              this.getUserAlbumsList();
            } else this.$common.warning(res.message || '删除相册失败');
          }
        }
      });
    },
    trigger(e) {
      this.$refs.uniFab.close(); // 收起按钮组
      if (!e && !e.item) return;
      switch (e.item.value) {
        // 新建相冊
        case 'create':
          uni.navigateTo({
            url: './create/create'
          });
          break;
        case 'upload':
          uni.navigateTo({
            url: './upload/upload'
          });
          break;
        default:
          break;
      }
    },
    // 获取用户相册列表
    async getUserAlbumsList() {
      const res = await this.$api.getAllalbums();
      if (res.status !== 200) return this.$common.error(res.message || '获取用户相册列表失败');
      this.albumsList = res.data;
    }
  }
};
</script>

<style lang="less" scoped>
.album-delete-button {
  position: absolute;
  right: -10rpx;
  top: 0;
}
.albums {
  padding-top: var(--status-bar-height);
  overflow-y: hidden;
  &-item {
    padding: 6rpx 0 6rpx 3rpx;
  }
  &-name, &-tips {
    padding-left: 24rpx;
    width: 100%;
    text-align: left;
  }
  &-name {
    font-size: 30rpx;
    color: @labelColor;
  }
  &-tips {
    font-size: 24rpx;
    color: @tipsColor;
  }
  &-img {
    width: 100%;
  }
}
</style>
