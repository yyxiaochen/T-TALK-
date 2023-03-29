<template>
	<view>
		<loading v-if="list == null"></loading>
		<template v-else>
			<no-data v-if="list.length <= 0"></no-data>
			<template v-else>
				<view class="in_group">
					<view class="clearfix li" v-for="item in list" @tap="app.openUrl({url:'/pages/show-info/show-info',data:{order_id:item.order_id}})">
						<image :src="item.avatar" mode="aspectFill"></image>
						<view class="info">
							<view class="nick flex">
								<view class="h3">
									{{item.nickname}}
									<image 
										style="width:30rpx;height:30rpx;" 
										:src="`../../static/img/${item.blind_sex == 1 ? 'nan' : 'nv'}.png`"
										mode="aspectFill"
									></image>
								</view>
								<view class="span">{{item.money}}</view>
							</view>
							<view class="time">{{app.getDateDiff(item.create_time)}}</view>
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
						url:"user/open_record",
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
		/* #ifdef MP */
		margin-top:10rpx;
		/* #endif */
		.li{
			background:#FFF;
			border-radius:13rpx;
			padding:45rpx 35rpx;
			padding-bottom:0;
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
				position:relative;
				padding-bottom:45rpx;
				&:after{
					content:"";
					position:absolute;
					right:0;
					bottom:0;
					height:1px;
					background:#F6F6F6;
					width:calc(100% - 27rpx);
				}
				.nick{
					flex-direction: row;
					.h3{
						flex:1;
						width:0;
						font-size:28rpx;
						font-weight:bold;
						line-height:40rpx;
						image{
							vertical-align: middle;
							margin-top:-2px;
							width:22rpx;
							margin-left:16rpx;
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
		}
	}
</style>
