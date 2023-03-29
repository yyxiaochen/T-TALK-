<!-- 开启盲盒 -->
<template>
	<view>
		<view
			class="shade" 
			:class="show ? 'show' : ''" 
			@tap="show = false" 
			@touchmove.stop.prevent
		>
			<view class="start-layer" :class="show ? 'show' : ''" @tap.stop>
				<text class="_title">请选择您想要匹配的性别</text>
				<view class="gender flex">
					<view class="item" :class="sex == 1 ? 'active' : ''" @tap.stop="sex = 1;">
						<image src="../../static/img/head_boy.png" mode="widthFix"></image>
						男
					</view>
					<view class="item" :class="sex == 2 ? 'active' : ''" @tap.stop="sex = 2;">
						<image src="../../static/img/head_girl.png" mode="widthFix"></image>
						女
					</view>
				</view>
				<view class="agreeRule" @tap.stop="agreen = !agreen">
					<image :src="!agreen ? '../../static/img/checked.png' :'../../static/img/checked_hover.png'" mode="widthFix"></image>
					我同意平台<text @tap.stop="app.openUrl({url:'/pages/pra/pra'})">《用户协议与隐私规则》</text>
				</view>
				<view class="start-btn flex" @tap.stop="pay">支付{{price}}元，开启盲盒</view>
			</view>
		</view>
		<pay-code ref="pay-code" @call="payCodeCall"></pay-code>
	</view>
</template>

<script>
	export default {
		props: {
			price: {
				type: String | Number,
				default: "-" //自动滚动速度，越高滚动越慢,0不滚动，设置负数，则反方向滚动
			},
		},
		data() {
			return {
				show:false,
				agreen:true,
				sex:2,
			};
		},
		methods: {
			//支付弹窗按钮点击回调
			payCodeCall(e){
				var _this = this;
				_this.$refs['pay-code'].close();
				if(e.type == "success"){
					_this.checkPay(e.order_id);
				}
				if(e.type == "error"){
					
				}
			},
			
			//点击支付按钮
			pay(){
				var _this = this;
				if(_this.agreen){
					if(!_this.app.isWeixin()){
						_this.app.toast("请在微信内部打开");
						return;
					}
					_this.app.ajax({
						url:"user/get_blind",
						method:"post",
						load:true,
						data:{
							sex: _this.sex
						},
						success:function(res){
							var order_id = res.data.order_id;
							if(res.data.pay_type == "wechat"){
								_this.app.wxPay({
									type: "wxPublic",
									appId: res.data.data.appId,
									nonceStr: res.data.data.nonceStr,
									package: res.data.data.package,
									paySign: res.data.data.paySign,
									signType: res.data.data.signType,
									timeStamp: res.data.data.timeStamp
								},function(res){
									_this.show = false;
									_this.app.alert({
										content:"支付成功",
										success:function(){
											_this.checkPay(order_id);
										}
									});
								},function(res){
									console.log(res);
								});
							}else if(res.data.pay_type == "qianxun"){
								_this.$refs['pay-code'].open({
									image: res.data.data,
									order_id: order_id,
								})
							}
						}
					});
				}else{
					_this.app.toast("请先同意协议");
				}
			},
			
			//检查是否支付完成？
			checkPay(order_id){
				var _this = this;
				_this.app.ajax({
					url:"user/order_verify",
					method:"post",
					load:true,
					data:{
						order:order_id
					},
					success:function(res){
						_this.show = false;
						if(res.data.is_pay){
							_this.app.openUrl({url:'/pages/show-info/show-info',data:{order_id:res.data.order_id}});
						}else{
							_this.app.toast("你还未支付呢");
						}
					}
				});
			},
			
			//打开弹窗
			open(){
				var _this = this;
				if(_this.app.isLogin()){
					_this.sex = 2;
					_this.agreen = true;
					_this.show = true;
				}else{
					_this.app.toLogin();
				}
			},
		
		}
	}
</script>

<style scoped lang="scss">
	.shade{
		transform: translateZ(2000px);
		.start-layer{
			background:#FFF;
			position:absolute;
			left:50%;
			top:50%;
			padding:60rpx 50rpx;
			visibility:visible;
			border-radius:35rpx;
			transition: 0.2s all;
			transform: translate(-50%,-50%) scale(0);
			width:88%;
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
				margin-bottom:42rpx;
			}
			.gender{
				flex-direction: row;
				.item{
					flex:1;
					width:0;
					font-size:28rpx;
					color:#999;
					text-align:center;
					image{
						width:122rpx;
						height:122rpx;
						display: block;
						margin:0 auto;
						margin-bottom:20rpx;
						border-radius:50%;
						border:4rpx solid #FFF;
					}
					&.active{
						font-weight:bold;
						color:#5330d8;
						image{
							border:4rpx solid #5330d8;
						}
					}
				}
			}
			.agreeRule{
				margin-top:40rpx;
				font-size:27rpx;
				line-height:40rpx;
				text-align: center;
				text{
					color:rgb(0, 122, 255);
					font-size:27rpx;
					line-height:40rpx;
				}
				image{
					width:40rpx;
					vertical-align: middle;
					margin-top:-4rpx;
					margin-right:15rpx;
				}
			}
			.start-btn{
				display:block;
				flex-direction: row;
				background:linear-gradient(to left, #4e2bd4, #7f5dff);
				border-radius:100rpx;
				line-height:98rpx;
				width:90%;
				margin:0 auto;
				align-items: center;
				text-align:center;
				color:#FFF;
				font-weight:bold;
				font-size:32rpx;
				margin-top:40rpx;
				&:active{
					opacity: 0.8;
				}
			}
		}
	}
</style>
