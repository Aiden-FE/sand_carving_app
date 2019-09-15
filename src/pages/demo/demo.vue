<template>
	<view>
		<view class="">
      <text>日程标题: {{ info && info.data && info.data.name}}</text>
      <br />
      <text>日程描述: {{ info && info.data && info.data.custom}}</text>
      <uni-calendar 
          :insert="true"
          :lunar="true"
          :selected="selected"
          :start-date="'2018-3-2'"
          :end-date="'2019-12-20'"
          @change="change"
           />
    </view>
	</view>
</template>

<script>
  import {uniCalendar} from "@/components/uni-calendar/uni-calendar.vue"
	export default {
    components: {
      uniCalendar
    },
		data() {
			return {
        info: null,
				selected: [// 是否打点
          {
            "have": true,
            // 打点日期
            "date": "2019-08-27",
            // 打点描述
            "info": "姨妈来了",
            // 额外信息
            "data": {
                "custom": "今天群群来例假了",
                "name": "要喷血了"
            },
          },
          {
            "have": true,
            // 打点日期
            "date": "2019-09-22",
            // 打点描述
            "info": "签到",
            // 额外信息
            "data": {
                "custom": "自定义信息",
                "name": "自定义消息头"
            },
          },
          {
            "have": true,
            // 打点日期
            "date": "2019-09-23",
            // 打点描述
            "info": "签到",
            // 额外信息
            "data": {
                "custom": "自定义信息",
                "name": "自定义消息头"
            },
          },
        ]
			};
		},
    methods:{
      change(e) {
        this.info = e.clockinfo || null
        console.log(this.info);
      }
    }
	}
</script>

<style lang="less">

</style>
