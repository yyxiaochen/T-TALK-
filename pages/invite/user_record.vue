<template>
	<view>
		<loading v-if="list == null"></loading>
		<template v-else>
			<no-data v-if="list.length <= 0"></no-data>
			<template v-else>
				<view class="in_group">
					<view class="clearfix li" v-for="(item,index) in list">
					    <image :src="item.avatar" mode="aspectFill"></image>
					    <view class="info">
					        <view class="nick flex">
					            <view class="h3 ell">{{item.nickname}}</view>
					            <view class="span">{{item.invite_text}}</view>
					        </view>
					        <view class="time">{{app.getDateDiff(item.create_time)}}</view>
					    </view>
					    <view class="data flex">
					        <view>
								<image src="../../static/img/icon_mycoin_newcoin.png" mode="heightFix"></image>
								拆盲盒提成
								<view class="b ell">
									{{item.open_money}}
									<text>元</text>
								</view>
							</view>
					        <view>
								<image src="../../static/img/isd.png" mode="heightFix"></image>
								存盲盒提成
								<view class="b ell">
									{{item.save_money}}
									<text>元</text>
								</view>
							</view>
					    </view>
					</view>
				</view>
				<load-footer-text :load="hasMore"></load-footer-text>
			</template>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				list:null,
				page:1,
				hasMore:true,
				hasLoading:false,
			}
		}, 
		methods: {
			getList(){
				var _this = this;
				if(_this.hasMore && !_this.hasLoading){
					_this.hasLoading = true;
					_this.app.ajax({
						url:"invite/user_list",
						data:{
							page:_this.page,
						},
						success:function(res){
							if(_this.page==1){
								_this.list = res.data.list;
							}else{
								_this.list = _this.list.concat(res.data.list);
							}
				
							_this.hasMore = res.data.hasMore;
							if(res.data.hasMore){
								_this.page++;
							}
						},
						done:function(){
							_this.hasLoading = false;
						}
					});
				}
			},

		},
		onShow(){

		},
		mounted(){
			this.getList();
		},
		onPullDownRefresh(){
			this.page = 1;
			this.hasMore = true;
			this.hasLoading = false;
			this.getList();
		},
		onReachBottom(){
			this.getList();
		}
	}
</script>

<style lang="scss" scoped>
	.in_group{
		margin-top:12rpx;
		.li{
			background:#FFF;
			margin:0 12rpx;
			margin-bottom:12rpx;
			border-radius:13rpx;
			padding:45rpx 35rpx;
			padding-bottom:40rpx;
			&:nth-last-child(1){
				margin-bottom:0;
			}
			&>image{
				display: block;
				width:92rpx;
				height:92rpx;
				border-radius:50%;
				float:left;
			}
			&>.info{
				padding-left:27rpx;
				float:left;
				width:calc(100% - 92rpx);
				padding-top:5rpx;
				.nick{
					flex-direction: row;
					.h3{
						flex:1;
						width:0;
						font-size:29rpx;
						font-weight:bold;
						line-height:40rpx;
						image{
							vertical-align: middle;
							margin-top:-2px;
							width:35rpx;
							margin-left:10rpx;
						}
					}
					.span{
						font-size:28rpx;
						line-height:40rpx;
						color:#999;
						display: block;
					}
				}
				.time{
					line-height:40rpx;
					font-size:28rpx;
					color:#999;
					margin-top:8rpx;
				}
			}
			&>.data{
				width:100%;
				margin-top:35rpx;
				float:left;
				view{
					line-height:40rpx;
					float:left;
					font-size:26rpx;
					color:#898989;
					width:calc(100% / 2);
					text-align:center;
					&:nth-child(1){
						padding-left:12rpx;
					}
					&:nth-child(2){
						padding-left:12rpx;
					}
					image{
						height:30rpx;
						vertical-align: middle;
						margin-right:10rpx;
					}
					.b{
						display:block;
						color:#333;
						margin-top:10rpx;
						font-size:29rpx;
						width: 100%;
						font-weight:bold;
						text{
							margin-left:5rpx;
							font-size:26rpx;
							font-weight:normal;
						}
					}
				}
			}
		}
	}
</style>
