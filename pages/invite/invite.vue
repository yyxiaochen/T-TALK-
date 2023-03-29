<template>
	<view class="invite">
		<view class="main">
			<image src="../../static/img/invite.png" mode="widthFix" class="bg"></image>
			<view class="po">
				<view class="_data flex">
					<view class="item">
						<view class="_title">邀请人数</view>
						<view class="num ell"><text>{{info ? info.invite_info.all_friend : "-"}}</text>人</view>
						<view class="btn" @tap="app.openUrl({url:'/pages/invite/user_record'})">查看</view>
					</view>
					<view class="item">
						<view class="_title">总佣金</view>
						<view class="num ell"><text>{{info ? info.invite_info.all_money : "-"}}</text>元</view>
						<view class="btn" @tap="app.openUrl({url:'/pages/invite/wallet_record'})">查看</view>
					</view>
					<view class="item">
						<view class="_title">可提现</view>
						<view class="num ell" style="color:#ffce26;"><text>{{info ? info.invite_info.balance : "-"}}</text>元</view>
						<view class="btn" style="color:#ffce26;" @tap="cash">提现</view>
					</view>
				</view>
				<view class="_shareView flex">
					<div class="info">
						<text class="one">分享好友获赏金</text>
						<text class="two">当月老也能赚钱啦~</text>
					</div>
					<view class="a" @tap="$refs['share-layer'].show = true">去分享</view>
				</view>
				<view class="_getMoney flex">
					<view class="item">
						<view class="price ell">{{info ? (parseInt((info.next_open / info.save_price * 100))) : "-"}}<text>%</text></view>
						<view class="desc ell">下级好友</view>
						<view class="h3 ell">拆盲盒</view>
					</view>
					<view class="item">
						<view class="price ell">{{info ?  (parseInt((info.next_save / info.dismantle_price * 100))) : "-"}}<text>%</text></view>
						<view class="desc ell">下级好友</view>
						<view class="h3 ell">存盲盒</view>
					</view>
					<view class="item">
						<view class="price ell">N<text>%</text></view>
						<view class="desc ell">区域代理</view>
						<view class="h3 ell">内测阶段</view>
					</view>
				</view>
			</view>
		</view>
		<view class="rule">
			1.邀请好友成为自己的下级，下级消费后 我获得佣金<br />
			2.区域代理仅为部分内测用户开放<br />
			3.佣金秒到，满1元即可提现<br />
			4.严禁作弊手段刷虚拟注册<br />
			5.最终解释权归平台所有
		</view>

		<share-layer 
			ref="share-layer" 
			:info='{
				list:[
					{icon:"../../static/img/saveImage.png",name:"海报",key:"photo"},
					{icon:"../../static/img/link.png",name:"链接",key:"link"}
				]
			}'
			@share="share"
		></share-layer>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				info:null,
			}
		}, 
		methods: {
			
			//获取基本数据
			getData(){
				var _this = this;
				_this.app.ajax({
					url:"invite/index",
					success:function(res){
						_this.info = res.data;
					}
				});
			},
			
			//分享回调
			share(e){
				var _this = this;
				if(e == "photo"){
					uni.previewImage({
						urls: [_this.info.invite_poster],
					});
				}else if(e == "link"){
					uni.setClipboardData({
						data: _this.info.invitation_url,
						success:function(){
							_this.app.toast("复制链接成功");
						}
					})
				}
			},
			
			//提现post
			cash(){
				var _this = this;
				if(_this.info.invite_info.balance > 0){
					_this.app.confirm({
						content:`提现审核将在24小时内完成，真的要提现${_this.info.invite_info.balance}元吗？`,
						success:function(){
							_this.app.ajax({
								url:"invite/cash",
								load:true,
								success:function(res){
									_this.app.toast(res.msg);
									_this.getData();
								}
							});
						}
					})
				}else{
					_this.app.toast("你当前没有余额。");
				}
			},
		},
		onPullDownRefresh(){
			this.getData();
		},
		mounted(){
			this.getData();
		},
	}
</script>

<style lang="scss" scoped>
	.invite{
		background:#2325ba;
		min-height:100vh;
		padding-bottom:2rpx;
		.main{
			position:relative;
			.bg{
				display: block;
				width:100%;
			}
			.po{
				position:absolute;
				top:495rpx;
				left:0;
				right:0;
				padding:0 30rpx;
				._data{
					padding:0 60rpx;
					flex-direction: row;
					.item{
						flex:1;
						width:0;
						text-align:center;
						._title{
							color:rgba(255,255,255,0.7);
							font-size:28rpx;
							line-height:40rpx;
						}
						.num{
							line-height:70rpx;
							color:#FFF;
							font-size:28rpx;
							margin-top:10rpx;
							text{
								font-weight:bold;
								font-size:42rpx;
								line-height:60rpx;
							}
						}
						.btn{
							line-height:60rpx;
							color:#FFF;
							font-size:27rpx;
							background:rgba(255,255,255,0.08);
							margin:0 20rpx;
							border-radius:100rpx;
							&:active{
								opacity: 0.8;
							}
						}
					}
				}
			}
			._shareView{
				padding:0 80rpx 0 120rpx;
				margin-top:113rpx;
				flex-direction: row;
				align-items: center;
				.info{
					flex:1;
					width:0;
					.one{
						display: block;
						color:#FFF;
						font-weight:bold;
						font-size:32rpx;
						line-height:40rpx;
					}
					.two{
						display: block;
						color:#FFF;
						font-size:28rpx;
						opacity: 0.8;
						line-height:40rpx;
						margin-top:10rpx;
					}
				}
				.a{
					background:#FFF;
					color:#ef3285;
					line-height:60rpx;
					height:60rpx;
					padding:0 40rpx;
					border-radius:100rpx;
					font-size:30rpx;
					&:active{
						opacity: 0.8;
					}
				}
			}
			._getMoney{
				margin-top:130rpx;
				padding:0 10rpx;
				.item{
					flex:1;
					width:0;
					margin-right:31rpx;
					text-align:center;
					padding:30rpx 20rpx 0 20rpx;
					&:nth-child(3n){
						margin-right:0;
					}
					.price{
						color:#fa3c5f;
						font-weight:bold;
						font-size:42rpx;
						line-height:40rpx;
						text{
							font-weight:bold;
							font-size:27rpx;
						}
					}
					.desc{
						font-size:22rpx;
						background:rgba(255,255,255,0.12);
						border-radius:100rpx;
						line-height:40rpx;
						color:#FFF;
						width:80%;
						margin:0 auto;
						margin-top:38rpx;
					}
					.h3{
						color:#FFF;
						font-size:27rpx;
						margin-top:13rpx;
						line-height:30rpx;
					}
				}
			}
		}
		.rule{
			padding:30rpx 30rpx;
			font-size:28rpx;
			color::#b6b7ff;
			background:rgba(255,255,255,0.08);
			margin:0 30rpx 30rpx 30rpx;
			border-radius:15rpx;
			line-height:55rpx;
		}
	}
</style>
