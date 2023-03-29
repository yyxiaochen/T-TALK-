<template>
	<view class="loadText">
		<view class="weui-loadmore" v-if="load">
			<view class="weui-loading"></view>
			<text class="weui-loadmore__tips">正在加载</text>
		</view>
		<text v-else class="over">我已经到底啦！</text>
	</view>
</template>

<script>
	export default {
		props:{
			load:{
				type:Boolean,
				default:true,
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	.loadText {
		text-align: center;
		padding: 30rpx 0;
		.weui-loadmore {
			width: 65%;
			text-align: center;
			font-size: 27rpx;
			margin: 0 auto;
			line-height:40rpx;
			.weui-loading{
				width: 30rpx;
				height: 30rpx;
				border: 5rpx solid #ececec;
				border-bottom-color: #d1d1d1;
				border-radius: 50%;
				display: inline-block;
				animation: rotation 1s linear infinite;
				vertical-align: middle;
			}
			.weui-loadmore__tips {
				display: inline-block;
				vertical-align: middle;
				color: #c9c9c9;
				vertical-align: middle;
				margin-left:10rpx;
			}
		}
		.over {
			font-size:27rpx;
			color: #c9c9c9;
			line-height: 40rpx;
		}
		@keyframes rotation {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(360deg);
			}
		}
	}
</style>
