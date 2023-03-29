<template>
	<view>
		<loading v-if="info == null"></loading>
		<template v-else>
			<view class="show-info">
				<view class="complate" @tap="complate">投诉</view>
				<image src="../../static/img/showbg.png" mode="widthFix" class="bg"></image>
				<view class="avatar">
					<image :src="info.avatar" mode="aspectFill" @tap="app.openImage(0,[info.avatar])"></image>
				</view>
				<view class="main">
					<view class="h3 ell">{{info.nickname}}</view>
					<view class="time">@期待找到另一半~</view>
					<view class="btn flex">
						<view class="item" @tap="concat('mobile')">
							<image src="../../static/img/mobile.png" mode="widthFix"></image>
						</view>
						<view class="item" @tap="concat('wechat')" style="width:260rpx;margin-right:0;background:linear-gradient(to right,#47da5f,#51c163);">
							<image src="../../static/img/wx.png" mode="aspectFill" style="margin-right:15rpx;"></image>微信联系
						</view>
					</view>
					<view class="intro">
						<view class="_title">自我介绍</view>
						<view class="desc">
							{{info.introduction || "很遗憾，该用户没有留下自我介绍"}}
						</view>
						<view class="tag flex" v-if="info.interest.length > 0">
							<text v-for="(item,index) in info.interest">{{item}}</text>
						</view>
						<view style="height:40rpx;"></view>
						<template v-if="info.photos.length > 0">
							<view class="_title">TA的照片</view>
							<view class="my_photos flex">
								<image :src="item" mode="aspectFill" v-for="(item,index) in info.photos" @tap="app.openImage(index,info.photos)"></image>
							</view>
						</template>
					</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				order_id:"",
				info:null,
			}
		}, 
		methods: {
			complate(){
				var _this = this;
				var itemList = [
					"虚假资料",
					"信息涉嫌违法违规",
					"无法联系微信/电话",
					"辱骂侮辱他人"
				];
				
				uni.showActionSheet({
				    itemList: itemList,
				    success: function (res) {
						_this.app.ajax({
							url:"index/complaint",
							data:{
								id:_this.info.id,
								content:itemList[res.tapIndex],
							},
							load:true,
							method:"post",
							success:function(res){
								_this.getData();
								_this.app.toast(res.msg);
							},
						});
				    }
				});
			},
			concat(type){
				var _this = this;
				if(_this.info == null){
					return;
				}
				
				if(type == "mobile"){
					if(_this.info.phone_number){
						uni.makePhoneCall({
						    phoneNumber: _this.info.phone_number //仅为示例
						});
					}else{
						_this.app.toast("TA没有留下手机号");
					}
				}else if(type == "wechat"){
					if(_this.info.wechat_number){
						uni.setClipboardData({
						    data: _this.info.wechat_number,
						    success: function () {
								uni.hideToast();
								uni.showModal({
								    title: '提示',
								    content: `已复制成功，请去添加微信号${_this.info.wechat_number}吧`,
									showCancel:false,
								});
						    },
							fail:function(){
								_this.app.toast("复制失败");
							}
						});
					}else{
						_this.app.toast("TA没有留下微信号");
					}
				}
			},
			getData(){
				var _this = this;
				_this.app.ajax({
					url:"user/get_blind_info",
					data:{
						order_id:_this.order_id,
					},
					success:function(res){
						var arry = [];
						for(var i in res.data.photos){
							arry.push(res.data.photos[i].url);
						}
						res.data.photos = arry;

						_this.info = res.data;
					},
				});
			},
		},
		onLoad(e){
			this.order_id = e.order_id;
			this.getData();
		},
	}
</script>

<style lang="scss" scoped>
	.show-info{
		min-height:100vh;
		position:relative;
		padding-top:130rpx;
		background:#FFF;
		.complate{
			position:absolute;
			right:40rpx;
			top:45rpx;
			font-size:28rpx;
			color:#999;
			z-index:2;
		}
		.bg{
			display: block;
			width:100%;
			opacity: 0.6;
			position:absolute;
			top:0;
			left:0;
		}
		.avatar{
			position:relative;
			z-index:1;
			image{
				display: block;
				margin:0 auto;
				border:10rpx solid #FFF;
				border-radius:50%;
				width:260rpx;
				height:260rpx;
				box-shadow: 0 6px 23px #e0e0e0;
			}
		}
		.main{
			margin-top:35rpx;
			padding:0 40rpx 30rpx 40rpx;
			.h3{
				color:#203152;
				font-weight:bold;
				font-size:45rpx;
				line-height:60rpx;
				text-align:center;
			}
			.time{
				color:#7c8daf;
				font-size:28rpx;
				line-height:40rpx;
				text-align:center;
				margin-top:20rpx;
			}
			.btn{
				flex-direction: row;
				justify-content: center;
				margin-top:40rpx;
				.item{
					margin-right:40rpx;
					background:linear-gradient(to right,#8cdaff,#5ac8fd);
					border-radius:500rpx;
					height:90rpx;
					line-height:90rpx;
					width:90rpx;
					text-align:center;
					color:#FFF;
					font-size:30rpx;
					&:active{
						opacity: 0.8;
					}
					image{
						vertical-align: middle;
						width:50rpx;
						height:50rpx;
					}
				}
			}
			.intro{
				margin-top:80rpx;
				._title{
					font-size:30rpx;
					font-weight:bold;
					color:#203152;
					line-height:40rpx;
				}
				.desc{
					margin-top:20rpx;
					line-height:50rpx;
					font-size:28rpx;
					color:#556482;
				}
				.tag{
					margin-top:30rpx;
					flex-direction: row;
					flex-wrap: wrap;
					text{
						font-size:27rpx;
						background:#F6F6F6;
						color:#666;
						line-height:62rpx;
						padding:0 30rpx;
						border-radius:10rpx;
						margin-right:20rpx;
						margin-bottom:20rpx;
					}
				}
				.my_photos{
					flex-direction: row;
					flex-wrap: wrap;
					margin-top:30rpx;
					image{
						border-radius:7rpx;
						display:block;
						width:calc((750rpx - 40rpx - 80rpx) / 3);
						height:calc((750rpx - 40rpx - 80rpx) / 3);
						margin-right:20rpx;
						margin-bottom:20rpx;
						&:nth-child(3n){
							margin-right:0;
						}
					}
				}
			}
		}
	}
</style>
