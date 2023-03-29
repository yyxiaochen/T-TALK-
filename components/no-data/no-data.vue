<template>
	<view class="m-no">
		<view class="u-img"></view>
		<view class="u-spec">没有资源啦</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	.m-no {
		padding-top: 60rpx;
		padding-bottom: 75rpx;
		.u-img {
			width:380rpx;
			height:270rpx;
			margin: 0 auto;
			background: url(../../static/img/noData.png) no-repeat center center;
			background-size: contain;
		}
		.u-spec {
			font-size:27rpx;
			line-height:40rpx;
			text-align: center;
			color: #c3c3c3;
			margin-top:20rpx;
		}
	}
</style>
