<template>
	<view class="save-info" @tap="bodyTap">
		<loading v-if="info == null"></loading>
		<template v-else>
			<template>
				<view class="online-status flex" v-if="info.blind_status.is_blind == -1" style="background:#effaff;">
					<view class="info">
						<view class="h3">尽可能填写真实信息..</view>
						<view class="p">提交后客服将进行认真审核</view>
					</view>
					<image src="../../static/img/img_guide_video_chat.png" mode="heightFix"></image>
				</view>
				<view class="online-status flex" v-if="info.blind_status.is_blind == 0" style="background:#fffbee;">
					<view class="info">
						<view class="h3">您的盲盒正在审核..</view>
						<view class="p">通常在24小时内被处理完成</view>
					</view>
					<image src="../../static/img/img_guide_video_chat.png" mode="heightFix"></image>
				</view>
				<view class="online-status flex" v-if="info.blind_status.is_blind == 1">
					<view class="info">
						<view class="h3">您正在盲盒之中..</view>
						<view class="p">还剩{{info.blind_status.surplus_number}}次可被异性开启的机会~</view>
					</view>
					<image src="../../static/img/img_123.png" mode="heightFix"></image>
				</view>
				<view class="online-status flex" v-if="info.blind_status.is_blind == 2" style="background:#f9f9f9;">
					<view class="info">
						<view class="h3">你的盲盒已被下架..</view>
						<view class="p">{{input.remarks || "赶快重新填写资料再次匹配吧~"}}</view>
					</view>
					<image src="../../static/img/img_guide_video_chat.png" mode="heightFix"></image>
				</view>
			</template>
			<view class="sp-view">
				<view class="save-title">微信号<text>*</text></view>
				<input type="text" placeholder="记得开启微信号被搜索权限" v-model="input.wechat_number" class="input" :disabled="disabled" />
			</view>
			<view class="sp-view">
				<view class="save-title">你的性别<text>*</text></view>
				<view class="gender flex">
					<view class="item" :class="input.blind_sex == 1 ? 'active' : ''" @tap="sexChange(1)">
						<image src="../../static/img/head_boy.png" mode="widthFix"></image>男生
					</view>
					<view class="item" :class="input.blind_sex == 2 ? 'active' : ''" @tap="sexChange(2)">
						<image src="../../static/img/head_girl.png" mode="widthFix"></image>女生
					</view>
				</view>
			</view>
			<view class="sp-view">
				<view class="save-title">自我介绍</view>
				<view class="textarea">
					<textarea placeholder="最长500字" v-model="input.introduction" :disabled="disabled" />
					<view class="photos flex">
						<view class="item" v-for="(item,index) in input.photos" @tap="openImage(index)">
							<image :src="item.url" mode="aspectFill"></image>
						</view>
						<view class="item" v-if="input.photos.length <= 6" @tap="upload(-1)">
							<image src="../../static/img/upload.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="sp-view" style="margin-top:40rpx;" v-if="!showMoreInfo">
				<a class="showMoreInfo" @tap="showMoreInfo = true;">点我填写更多信息，让对象更好的找到你~</a>
			</view>
			<template v-if="showMoreInfo">
				<view class="sp-view">
					<view class="save-title">手机号码</view>
					<input type="tel" placeholder="方便另一半找到你~" maxlength="11" v-model="input.phone_number" class="input" :disabled="disabled" />
				</view>
				<view class="sp-view">
					<view class="tag flex">
						<text v-for="(item,index) in info.interesting_list" @tap="selectInterseting(item)" :class="input.interest.indexOf(item) != -1 ? 'active' : ''">{{item}}</text>
					</view>
				</view>
			</template>
			<template v-if="info">
				<view class="btn" @tap.stop="save" v-if="info.blind_status.is_blind == -1 || info.blind_status.is_blind == 2">支付{{info.save_price}}元，将信息存入盲盒</view>
				<view class="btn disabled" v-if="info.blind_status.is_blind == 0">等待审核中</view>
				<view class="btn" @tap.stop="unSave" v-if="info.blind_status.is_blind == 1">下架我的盲盒</view>
			</template>
		</template>
		<pay-code ref="pay-code" @call="payCodeCall"></pay-code>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				showMoreInfo:false,
				info:null, //基本信息
				input:{ //用户需要输入的信息
					wechat_number:"",
					interest:[],
					introduction:"",
					phone_number:"",
					blind_sex:1,
					photos:[],
				},
			}
		},
		computed:{
			disabled(){
				return (this.info.blind_status.is_blind == 0 || this.info.blind_status.is_blind == 1) ? true : false;
			}
		},
		methods: {
			
			//支付弹窗按钮点击回调
			payCodeCall(e){
				var _this = this;
				_this.$refs['pay-code'].close();
				_this.info = null;
				_this.getData();
				_this.app.goBack();
			},
			
			//获取基本数据
			getData(){
				var _this = this;
				_this.app.ajax({
					url:"user/user_blind_info",
					success:function(res){
						//一些基本信息
						_this.info = res.data;
						
						//当前盲盒信息
						res.data.info && (_this.input = res.data.info);
					}
				});
			},
			
			//查看图片
			openImage(index){
				var _this = this;
				if(_this.disabled){
					return;
				}
				uni.showActionSheet({
					itemList: ['查看该图片', '替换图片', '删除图片'],
					success: function (res) {
						if(res.tapIndex == 0){
							var arry = [];
							for(var i in _this.input.photos){
								arry.push(_this.input.photos[i].url);
							}
							_this.app.openImage(index,arry);
						}else if(res.tapIndex == 1){
							_this.upload(index);
						}else if(res.tapIndex == 2){
							_this.input.photos.splice(index,1);
						}
					}
				});
			},
			
			//上传
			upload(index){
				var _this = this;
				if(_this.disabled){
					return;
				}
				uni.chooseImage({
					count: 1, //默认9
					success: function (res) {
						_this.app.ajax({
							url:"user/upload_img",
							method:"upload",
							load:true,
							filePath: res.tempFilePaths[0],
							success:function(res){
								_this.$forceUpdate();
								if(index==-1){
									_this.input.photos.push(res.data);
								}else{
									_this.input.photos[index] = (res.data);
								}
							}
						});
					}
				});
			},

			//性别选择
			sexChange(sex){
				if(this.disabled){
					return;
				}
				this.input.blind_sex = sex;
			},
			
			//兴趣爱好点击
			selectInterseting(item){
				var _this = this;
				if(_this.disabled){
					return;
				}
				if(_this.input.interest.indexOf(item) == -1){
					_this.input.interest.push(item);
				}else{
					_this.input.interest.splice(_this.input.interest.indexOf(item),1);
				}
			},
			
			//整个大div的点击事件
			bodyTap(){
				if(this.info.blind_status.is_blind == 0){
					this.app.toast("待审核状态不可编辑");
				}else if(this.info.blind_status.is_blind == 1){
					this.app.toast("已上架状态不可编辑，可下架后重新编辑。");
				}
			},
			
			//将盲盒提交存入审核
			save(){
				var _this = this;
				if(!_this.app.isWeixin() && _this.info.save_price > 0){
					_this.app.toast("请在微信内部打开");
					return;
				}
				
				var intersest = JSON.parse(JSON.stringify(_this.input.interest));
				for(var i in intersest){
					if(intersest[i] == ""){
						intersest.splice(i,1);
					}
				}
				_this.input.interest = intersest;
				
				_this.app.confirm({
					content: `请确认您的信息真实有效以便匹配准确的灵魂对象${_this.info.save_price ? ('，您即将支付' + _this.info.save_price + '元') : ''}，提交后等待客服审核。`,
					success:function(){
						_this.app.ajax({
							url:"user/save_blind",
							method:"post",
							load:true,
							data:_this.input,
							success:function(res){
								if(_this.info.save_price > 0){
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
											_this.app.alert({content:"支付成功"});
											_this.app.goBack();
										},function(res){
											console.log(res);
										});
									}else if(res.data.pay_type == "qianxun"){
										_this.$refs['pay-code'].open({
											image: res.data.data,
											order_id:"",
										})
										
										// location = (res.data.data);
									}
								}else{
									_this.app.alert({content:res.msg});
									_this.app.goBack();
								}
							}
						});
					}
				})
			},
			
			//将盲盒提交下架
			unSave(){
				var _this = this;
				_this.app.confirm({
					content: `真的要下架您的盲盒吗？下架后需重新提交审核哦~`,
					success:function(){
						_this.app.ajax({
							url:"user/off_blind",
							method:"post",
							load:true,
							data:{
								id: _this.input.id,
							},
							success:function(res){
								_this.app.alert({content:res.msg});
								_this.getData();
							}
						});
					}
				})
			},
		
		},
		mounted(){
			this.getData();
		},
	}
</script>

<style lang="scss" scoped>
	.save-info{
		min-height:100vh;
		background:#FFF;
		padding:20rpx 40rpx;
		.online-status{
			background:#fff6f6;
			flex-direction: row;
			align-items: center;
			margin:0 -20rpx;
			padding:30rpx 50rpx;
			border-radius:10rpx;
			.info{
				flex:1;
				width:0;
				.h3{
					font-weight:bold;
					font-size:32rpx;
					line-height:50rpx;
				}
				.p{
					color:#999;
					font-size:28rpx;
					line-height:50rpx;
					margin-top:10rpx;
				}
			}
			image{
				height:150rpx;
			}
		}
		.sp-view{
			margin-top:55rpx;
			.save-title{
				font-size:32rpx;
				line-height:50rpx;
				font-weight:bold;
				text{
					margin-left:12rpx;
					font-size:30rpx;
					color:#F30;
				}
			}
			.gender{
				flex-direction: row;
				margin-top:30rpx;
				.item{
					flex:1;
					width:0;
					font-size:28rpx;
					color:#707070;
					text-align: center;
					&.active{
						color:$background;
						font-weight:bold;
					}
					image{
						display: block;
						margin:0 auto;
						width:140rpx;
						margin-bottom:20rpx;
					}
				}
			}
			.input{
				font-size:28rpx;
				line-height:60rpx;
				padding:15rpx 30rpx;
				height:90rpx;
				border-radius:10rpx;
				border:1px solid #F1F1F1;
				display: block;
				margin-top:25rpx;
			}
			.textarea{
				position:relative;
				padding:20rpx 30rpx;
				border-radius:10rpx;
				border:1px solid #F1F1F1;
				margin-top:25rpx;
				textarea{
					font-size:28rpx;
					line-height:50rpx;
					height:170rpx;
					display: block;
					width:100%;
				}
				.photos{
					flex-direction: row;
					flex-wrap: wrap;
					margin-top:26rpx;
					margin-bottom:-10rpx;
					.item{
						margin-right:22rpx;
						margin-bottom:22rpx;
						width:calc((750rpx - 44rpx - 80rpx) / 4);
						height:120rpx;
						border-radius:10rpx;
						overflow:hidden;
						&:nth-child(3n){
							margin-right:0;
						}
						image{
							display:block;
							width:100%;
							height:100%;
						}
					}
				}
			}
			.tag{
				margin-top:30rpx;
				flex-direction: row;
				flex-wrap: wrap;
				margin-bottom:-25rpx;
				text{
					border:2rpx solid #d5d5d5;
					color:#4e4e4e;
					margin-right:25rpx;
					margin-bottom:25rpx;
					width:calc((100% - 50rpx) / 3);
					display:block;
					line-height:70rpx;
					text-align:center;
					border-radius:100rpx;
					font-size:28rpx;
					&.active{
						border:2rpx solid #7a57ff;
						color:#7a57ff;
					}
					&:nth-child(3n){
						margin-right:0;
					}
				}
			}
			.showMoreInfo{
				color:#b7b7b7;
				font-size:28rpx;
				line-height:35rpx;
				text-align:center;
				display: block;
			}
		}
		.btn{
			width:80%;
			background:$bodyBackgroundLine;
			color:#FFF;
			font-weight:bold;
			font-size:32rpx;
			margin:0 auto;
			margin-top:60rpx;
			margin-bottom:40rpx;
			line-height:100rpx;
			text-align:center;
			border-radius:100rpx;
			&:active{
				opacity: 0.8;
			}
			&.disabled{
				background: #eeeeee;
				color: #878787;
			}
		}
	}
</style>
