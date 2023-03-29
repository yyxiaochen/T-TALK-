<template>
	<view>
		<loading v-if="list == null"></loading>
		<template v-else>
			<no-data v-if="list.length <= 0"></no-data>
			<template v-else>
				<view class="walletData">
					<view class="li" v-for="(item,index) in list">
						<view class="flex">
							<view class="h3 ell">{{item.title}}</view>
							<view class="span">{{item.money}}</view>
						</view>
						<view class="p">
							{{item.create_time}}
							<text class="font" style="float:right;font-size:26rpx;line-height:50rpx;">{{item.state}}</text>
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
						url:"invite/money_log",
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
		onReachBottom(){
			this.getList();
		}
	}
</script>

<style lang="scss" scoped>
	.walletData{
		background:#FFF;
		margin-top:9rpx;
		.li{
			padding:25rpx 30rpx;
			border-bottom:1px solid #F9F9F9;
			.flex{
				flex-direction: row;
				.h3{
					flex:1;
					width:0;
					font-size:30rpx;
					font-weight:normal;
					color:#333;
					padding-right:25rpx;
					line-height:50rpx;
				}
				.span{
					font-size:31rpx;
					color:#333;
					line-height:50rpx;
				}
			}
			.p{
				font-size:27rpx;
				color:#bfbfbf;
				margin-top:5rpx;
				line-height:50rpx;
			}
		}
	}
</style>
