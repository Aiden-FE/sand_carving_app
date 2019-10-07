<template>
	<view class="code-box">
		<view class="flex-box">
			<input
				type="number"
				focus="true"
				:maxlength="maxlength"
				class="hide-input"
				@input="getVal"
			/>
			<block v-for="(item, index) in ranges" :key="index">
				<view :class="['item', { active: codeIndex === item, middle: type === 'middle', bottom: type === 'bottom', box: type === 'box' }]">
					<view class="line" v-if="type !== 'middle'"></view>
					<view v-if="type === 'middle' && codeIndex <= item" class="bottom-line"></view>
					<block v-if="isPwd && codeArr.length >= item">
						<text class="dot">.</text>
					</block>
					<block v-else>	{{ codeArr[index] ? codeArr[index] : ''}}</block>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
export default {
	name: 'uiOneInput',
	props: {
		// 4/6
		maxlength: {
			type: Number,
			default: 4
		},
		isPwd: {
			type: Boolean,
			default: false
		},
		// middle-middle line, bottom-bottom line, box-square box
		type: {
			type: String,
			default: "middle"
		}
	},
	watch: {
		maxlength: {
			immediate: true,
			handler: function(newV) {
				if (newV === 6) {
					this.ranges = [1, 2, 3, 4, 5, 6]
				} else {
					this.ranges = [1, 2, 3, 4]
				}
			}
		}
	},
	data() {
		return {
			codeIndex: 1,
			codeArr: [],
			ranges: [1, 2, 3, 4]
		}
	},
	methods: {
		getVal(e) {
			let { value } = e.detail
			let arr = value.split('')
			this.codeIndex = arr.length + 1
			this.codeArr = arr
			if (this.codeIndex > Number(this.maxlength)) {
				this.$emit('finish',this.codeArr.join(''))
			}
		}
	}
}
</script>

<style scoped>
	@keyframes twinkling {
		0% {
			opacity: 0.2;
		}
		50% {
			opacity: 0.5;
		}
		100% {
			opacity: 0.2;
		}
	}
	.code-box {
		text-align: center;
	}
	.flex-box {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		position: relative;
	}
	.flex-box .hide-input {
		position: absolute;
		top: 0;
		left: -100%;
		width: 200%;
		height: 100%;
		text-align: left;
		z-index: 9;
		opacity: 1;
	}
	.flex-box .item {
		position: relative;
		width: 100upx;
		height: 100upx;
		margin-right: 18upx;
		font-size: 70upx;
		font-weight: bold;
		color: #333333;
		line-height: 100upx;
	}
	.flex-box .item:last-child {
		margin-right: 0;
	}
	.flex-box .middle {
		border: none;
	}
	.flex-box .box {
		box-sizing: border-box;
		border: 2upx solid #cccccc;
		border-radius: 6rpx;
	}
	.flex-box .bottom {
		box-sizing: border-box;
		border-bottom: 8rpx solid #212121;
	}
	.flex-box .active {
		border-color: #00C777;
	}
	.flex-box .active .line {
		display: block;
	}
	.flex-box .line {
		display: none;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 2upx;
		height: 40upx;
		background: #333333;
		animation: twinkling 1s infinite ease;
	}
	.flex-box .dot{
		font-size: 80upx;
		line-height: 40upx;
	}
	.flex-box .bottom-line {
		height: 4px;
		background: #000000;
		width: 80%;
		position: absolute;
		border-radius: 2px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
