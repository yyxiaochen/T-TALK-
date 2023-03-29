<template>
	<view class="index flex">
		<view class="rule" @tap="app.openUrl({url:'/pages/introduce/introduce'})">脱单介绍</view>
		<view class="user flex" @tap="userClick">
			<image :src="info.user.avatar" mode="aspectFill" v-if="info && info.user"></image>
			<image src="../../static/img/a3o.png" mode="aspectFill" v-else></image>
			<text class="ell">{{info && info.user ? info.user.nickname : "请先登录"}}</text>
		</view>
		<view class="index-ears">
			<xingqiu-tag :list="ballList"></xingqiu-tag>
		</view>
		<view class="index-center flex">
			<view class="desc-person">
				已有<text>{{info ? info.blink_box_ball.total : "-"}}</text>人将信息存入盲盒
			</view>
			<view class="flex btn-view">
				<view class="start-btn flex" @tap="$refs['start-layer'].open();">
					<image src="../../static/img/detail_unlike_shadow_icon.png" mode="widthFix"></image>
					抽对象
				</view>
				<view class="start-btn flex" @tap="app.openUrl({url:'/pages/save-info/save-info'});">
					<image src="../../static/img/img_1.png" mode="widthFix"></image>
					存信息
				</view>
			</view>
		</view>
		<view class="two-block flex">
			<!--view class="item" @tap="app.openUrl({url:'/pages/save-info/save-info'})">
				<view class="pover" :class="info && info.tags[0] ? '' : 'none'">
					<template v-if="info && info.tags[0]">
						<image src="../../static/img/cfo.png" mode="widthFix"></image>{{info.tags[0]}}
						<text></text>
					</template>
				</view>
				<view class="flex" style="background:linear-gradient(to right,#7b74e2,#b67ceb);">
					<image src="../../static/img/img_guide_video_chat.png" mode="heightFix"></image>
					<text class="h3 ell">信息存入</text>
					<text class="p ell">恋爱上门</text>
				</view>
			</view-->
			<view class="item" @tap="app.openUrl({url:'/pages/invite/invite'})">
				<view class="pover" :class="info && info.tags[0] ? '' : 'none'">
					<template v-if="info && info.tags[0]">
						<image src="../../static/img/isd.png" mode="widthFix"></image>{{info.tags[0]}}
						<text></text>
					</template>
				</view>
				<view class="flex" style="background:linear-gradient(to right, #009688, #1bdac8);margin-right:0rpx;">
					<image src="../../static/img/ic_mgs_group_hand.png" mode="heightFix"></image>
					<text class="h3 ell">邀请好友</text>
					<text class="p ell">赚钱利器</text>
				</view>
			</view>
			<view class="item" @tap="app.openUrl({url:'/pages/open-record/open-record'})">
				<view class="pover" :class="info && info.tags[1] ? '' : 'none'">
					<template v-if="info && info.tags[1]">
						<image src="../../static/img/cfo.png" mode="widthFix"></image>{{info.tags[1]}}
						<text></text>
					</template>
				</view>
				<view class="flex" style="background:linear-gradient(to right,#ff85a9,#fe997a);">
					<image src="../../static/img/hani_xianrenzhang.png" mode="heightFix"></image>
					<text class="h3 ell">盲盒历史</text>
					<text class="p ell">开启的记录</text>
				</view>
			</view>
			<view class="item" @tap="app.openUrl({url:'/pages/introduce/introduce'})" style="margin-right:0rpx;">
				<view class="pover" :class="info && info.tags[2] ? '' : 'none'">
					<template v-if="info && info.tags[2]">
						<image src="../../static/img/ic_mgs_group_hand.png" mode="widthFix"></image>{{info.tags[2]}}
						<text></text>
					</template>
				</view>
				<view class="flex" style="background:linear-gradient(to right,#5f90ee,#6abac7);">
					<image src="../../static/img/dyzem_rainbow.png" mode="heightFix"></image>
					<text class="h3 ell">介绍</text>
					<text class="p ell">脱单介绍</text>
				</view>
			</view>
		</view>
	
		<start-layer ref="start-layer" :price="dismantle_price"></start-layer>
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
		computed:{
			ballList(){
				return this.info ? this.info.blink_box_ball.list : [];
			},
			dismantle_price(){
				return this.info ? this.info.blink_box_ball.dismantle_price : "-";
			},
		},
		methods: {
			getData(){
				var _this = this;
				_this.app.ajax({
					url:"index",
					success:function(res){
						var length = res.data.blink_box_ball.list.length;
						if((50 - length) > 0){
							for(var i = 0;i < (50 - length);i++){
								res.data.blink_box_ball.list.push({
									avatar:"",
									nickname:"",
									id:"",
								});
							}
						}
						_this.info = res.data;
					}
				});
			},
			userClick(){
				var _this = this;
				if(_this.app.isLogin()){
					uni.showActionSheet({
					    itemList: ['更换头像', '退出账号'],
					    success: function (res) {
					        if(res.tapIndex == 0){
								uni.chooseImage({
									count: 1, // 默认9
									sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
									sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
									success(res) {
										const src = res.tempFilePaths[0];
										uni.navigateTo({
											url: '/pages/clip-avator/clip-avator?src=' + src
										})
									}
								});
							}else if(res.tapIndex == 1){
								_this.app.loginExit();
								_this.app.getData();
							}
					    }
					});
				}else{
					_this.app.toLogin();
				}
			},
		},
		onShow(){
			this.getData();
		},
		onLoad(e){
			e.i && uni.setStorageSync("inviteId",e.i);
		}
	}
</script>

<style lang="scss" scoped>
	.index{
		height:100vh;
		background:#12121f;
		flex-direction: column;
		position:relative;
		padding-bottom: env(safe-area-inset-bottom);
		.rule{
			background:#fe9485;
			color:#FFF;
			font-size:25rpx;
			position:absolute;
			left:0;
			top:300rpx;
			width:40rpx;
			text-align: center;
			line-height:30rpx;
			padding:15rpx 0;
			border-radius:0 10rpx 10rpx 0;
			&:active{
				opacity: 0.8;
			}
		}
		.user{
			position:absolute;
			/* #ifdef MP */
			border-radius:0 100rpx 100rpx 0;
			left:0;
			top:10rpx;
			/* #endif */
			/* #ifndef MP */
			border-radius:100rpx 0 0 100rpx;
			right:0;
			top:50rpx;
			/* #endif */
			background:rgba(255,255,255,0.15);
			color:#FFF;
			flex-direction: row;
			align-items: center;
			padding:10rpx 24rpx 10rpx 15rpx;
			image{
				margin-right:20rpx;
				width:50rpx;
				height:50rpx;
				border-radius:50%;
			}
			text{
				font-weight:bold;
				font-size:27rpx;
				max-width:190rpx;
			}
		}
		.index-ears{
			padding:140rpx 0 60rpx 0;
		}
		.index-center{
			flex:1;
			height:0;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.desc-person{
				font-size:22rpx;
				color:rgba(255,255,255,0.8);
				line-height:40rpx;
				margin-bottom:30rpx;
				text{
					color:#0bc273;
					font-size:22rpx;
				}
			}
			.btn-view{
				flex-direction: row;
				justify-content: center;
				width:85%;
				margin:0 auto;
				.start-btn{
					flex:1;
					transform: translateZ(2000px);
					display:block;
					flex-direction: row;
					background:linear-gradient(to left, #4e2bd4, #7f5dff);
					border-radius:100rpx;
					line-height:110rpx;
					align-items: center;
					text-align:center;
					color:#FFF;
					font-weight:bold;
					font-size:34rpx;
					//box-shadow: 0 0 20px #5633da;
					&:nth-last-child(1){
						margin-left:40rpx;
						background: linear-gradient(to left, #ffa760, #ff6d59);
					}
					image{
						width:50rpx;
						vertical-align: middle;
						margin-top:-4rpx;
						margin-right:20rpx;
					}
					&:active{
						opacity: 0.8;
					}
				}
			}
		}
		.two-block{
			flex-direction: row;
			padding:0 22rpx;
			padding-bottom:30rpx;
			.item{
				width:calc((100% - 30rpx) / 3);
				margin-right:20rpx;
				.pover{
					background:rgba(255,255,255,0.2);
					height:56rpx;
					line-height:56rpx;
					margin-bottom:30rpx;
					border-radius:20rpx;
					color:#FFF;
					font-size:23rpx;
					text-align:center;
					position:relative;
					&:after{
						content:"";
						position:absolute;
						bottom:-15rpx;
						left:50%;
						transform: translate(-50%,0);
						width: 0;
						height: 0;
						border-left: 7.5rpx solid transparent;
						border-right: 7.5rpx solid transparent;
						border-top: 15rpx solid rgba(255,255,255,0.2);
					}
					text{
						background:#fe5f63;
						width:12rpx;
						height:12rpx;
						border-radius:50%;
						position:absolute;
						top:0;
						right:10rpx;
						display: block;
					}
					image{
						width:35rpx;
						vertical-align: middle;
						margin-top:-2px;
						margin-right:10rpx;
					}
					&.none{
						opacity: 0;
					}
				}
				&>.flex{
					padding:0 25rpx;
					height:200rpx;
					border-radius:20rpx;
					flex-direction: column;
					justify-content: center;
					&:active{
						opacity: 0.8;
					}
					image{
						height:70rpx;
					}
					.h3{
						font-weight:bold;
						color:#FFF;
						margin-top:20rpx;
						font-size:28rpx;
						line-height:30rpx;
					}
					.p{
						color:rgba(255,255,255,0.8);
						font-size:22rpx;
						line-height:30rpx;
						margin-top:5rpx;
					}
				}
			}
		}
	}
</style>
