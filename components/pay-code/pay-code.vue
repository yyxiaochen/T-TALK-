<!-- 支付二维码 -->
<template>
	<view>
		<view
			class="shade" 
			:class="show ? 'show' : ''" 
			@tap="show = false" 
			@touchmove.stop.prevent
		>
			<view class="pay-layer" :class="show ? 'show' : ''" @tap.stop>
				<text class="_title">请长按识别二维码进行支付</text>
				<image :src="info.image" mode="widthFix"></image>
				<view class="btn flex">
					<view class="left" @tap="btn('error')">算了</view>
					<view class="right" @tap="btn('success')">我已支付</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false,
				info:{
					image:"",
					order_id:"",
				},
			};
		},
		methods: {
			//点击按钮
			btn(type){
				var _this = this;
				this.$emit("call",{type:type,order_id:_this.info.order_id});
			},
			
			//关闭弹窗
			close(){
				this.show = false;		
				this.info.order_id = "";
				this.info.image = "";
			},
			
			//打开弹窗
			open(e){
				this.info = e;
				this.show = true;
			},
		}
	}
</script>

<style scoped lang="scss">
	.shade{
		transform: translateZ(2000px);
		.pay-layer{
			background:#FFF;
			position:absolute;
			left:50%;
			top:50%;
			padding:60rpx 50rpx;
			visibility:visible;
			border-radius:35rpx;
			transition: 0.2s all;
			transform: translate(-50%,-50%) scale(0);
			width:73%;
			&.show{
				visibility:visible;
				transform: translate(-50%,-50%) scale(1);
			}
			._title{
				font-weight:bold;
				font-size:32rpx;
				text-align:center;
				line-height:40rpx;
				display: block;
				margin-bottom:25rpx;
			}
			image{
				display: block;
				width:100%;
				margin:0 auto;
			}
			.btn{
				flex-direction: row;
				margin-top:30rpx;
				view{
					flex:1;
					width:0;
					line-height:80rpx;
					border-radius:700rpx;
					text-align:center;
					font-size:28rpx;
					&:active{
						opacity: 0.8;
					}
				}
				.left{
					background:#F9F9F9;
					color:#666;
					margin-right:30rpx;
				}
				.right{
					font-weight:bold;
					background:$bodyBackgroundLine;
					color:#FFF;
				}
			}
		}
	}
</style>
