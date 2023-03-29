<!-- 分享弹窗 -->
<template>
	<view>
		<view class="shade" :class="show ? 'show' : ''" @tap="show = false;" @touchmove.stop.prevent>
			<view 
				class="share-layer" 
				:class="show ? 'show' : ''"
				@tap.stop
				@touchstart="touch"
				@touchmove="touch"
				@touchend="touch"
				:style="{
					transform:transfrom
				}"
			>
				<slot name="header"></slot>
				<view class="shareGroup flex">
				    <view class="item" @tap="share(item.key)" v-for="(item,index) in info.list">
				        <image :src="item.icon"></image>{{item.name}} 
				    </view>
				</view>
				<view class="cansel" @tap="show = false;">
					<text>取消</text>
					<footer-bar></footer-bar>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			info:{
				type:Object,
				default:{
					list:[],
				} 
			},
		},
		data() {
			return {
				show:false,
				touchPxClose:30,//手势移动多少个像素则关闭，若为0的时候则不启用手势
				startPx:0,//开始位置
				movePx: 0, //移动的像素
				direction:"bottom",
			};
		},
		computed:{
			transfrom(){
				var str = "";
				if(this.direction == "top"){
					str = 'translateY(-'+ this.movePx +'px)';
				}else if(this.direction == "bottom"){
					str = 'translateY('+ this.movePx +'px)';
				}else if(this.direction == "left"){
					str = 'translateX(-'+ this.movePx +'px)';
				}else if(this.direction == "right"){
					str = 'translateX('+ this.movePx +'px)';
				}
				return str;
			}
		},
		methods: {
			share(type){
				var _this = this;
				_this.show = false;
				if(_this.info.list.indexOf(type) != -1){
					if(type == "link"){
						uni.setClipboardData({
						    data: _this.shareData.url,
						    success: function () {
								_this.app.toast("复制成功");
						    },
							error:function(){
								_this.app.toast("复制失败");
							}
						});
						return;
					}
					
					//常用的分享
					var data = _this.shareData;
					data.type = type;
					_this.app.open_share(data);
				}else{
					_this.$emit('share',type);
				}
			},
			touch(e){
				if(this.touchPxClose > 0){
					if(e.type == "touchstart"){ //滑动开始
						var px = 0;
						if(this.direction == "top" || this.direction == "bottom"){
							px = e.touches[0].pageY;
						}else if(this.direction == "left" || this.direction == "right"){
							px = e.touches[0].pageX;
						}
						this.startPx = px;
					}else if(e.type == "touchmove"){ //滑动进行中
						var px = 0;
						if(this.direction == "top" || this.direction == "bottom"){
							px = e.touches[0].pageY;
						}else if(this.direction == "left" || this.direction == "right"){
							px = e.touches[0].pageX;
						}
						
						px = (px - this.startPx) / 3;
						this.movePx = (px<=0 ? 0 : px);
					}else if(e.type == "touchend"){ //滑动结束
						if(this.movePx >= this.touchPxClose){
							this.show = false;
							setTimeout(()=>{
								this.startPx = this.movePx = 0;
							},300);
						}else{
							this.startPx = this.movePx = 0;
						}
					} 
				}
			},
			
		}
	}
</script>

<style scoped lang="scss">
	.shade{
		.share-layer{
			background:#FFF;
			position:absolute;
			bottom:-100%;
			left:0;
			right:0;
			visibility:visible;
			border-radius:20rpx 20rpx 0 0;
			transition: 0.2s bottom;
			&.show{
				visibility:visible;
				bottom:0;
			}
			.shareGroup {
			    padding: 11rpx 15rpx;
			    padding-top: 50rpx;
				flex-direction: row;
				.item {
					flex:1;
					width:0;
				    text-align: center;
				    color: #a2a2a2;
				    font-size: 25rpx;
				    margin-bottom: 36rpx;
					image {
					    display: block;
					    margin: 0px auto;
					    border-radius: 50%;
					    width: 100rpx;
					    height: 100rpx;
					    margin-bottom: 20rpx;
					}
				}
			}
			.cansel {
			    background: #F9F9F9;
				padding-bottom: env(safe-area-inset-bottom);
				&:active {
					background: #F9F9F9;
				}
				text{
					text-align: center;
					color: #a2a2a2;
					display: block;
					width: 100%;
					font-size: 30rpx;
					line-height: 100rpx;
				}
			}
		}
	}
</style>