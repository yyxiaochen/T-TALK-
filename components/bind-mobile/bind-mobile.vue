<!-- 绑定手机 -->
<template>
	<view class="shade" :class="show ? 'show' : ''" @tap="show = false" @touchmove.stop.prevent>
		<view class="bind-layer" :class="show ? 'show' : ''" @tap.stop>
			<view class="h3">需绑定手机号码</view>
			<button class="button" hover-class="none" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
				<image src="../../static/img/mobile.png" mode="widthFix"></image>手机号授权
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			smallCode: {
				type: String,
				default: "",
			}
		},
		data() {
			return {
				show: false,
			};
		},
		methods: {
			//获取手机号码
			getPhoneNumber(res) {
				var _this = this;
				if (res.detail.encryptedData && res.detail.iv) {
					if (_this.smallCode) {
						_this.app.showLoading();
						uni.checkSession({
							success() {
								_this.app.ajax({
									url: "login/init_mobile",
									load: true,
									method: "post",
									token: _this.data.token,
									data: {
										encryptedData: res.detail.encryptedData,
										iv: res.detail.iv,
										code: _this.smallCode,
									},
									success: function(res) {
										_this.close();
										_this.app.toast(res.msg);
										_this.app.openUrl({url:"/pages/index/index",openType:"reLaunch"});
									},
									error: function(res) {
										_this.$parent.setLoginCode();
										_this.app.toast(res.msg);
									}
								});
							},
							fail() {
								_this.$parent.setLoginCode();
								_this.app.hideLoading();
								_this.app.toast("停留该页面已久，请重新授权");
							}
						});
					} else {
						_this.app.toast("正在获取code中,请稍后..");
					}
				}
			},

			//关闭弹窗
			close() {
				this.show = false;
			},

			//打开弹窗
			open() {
				this.show = true;
			},
		}
	}
</script>

<style scoped lang="scss">
	.shade {
		transform: translateZ(2000px);

		.bind-layer {
			background: #FFF;
			position: absolute;
			left: 50%;
			top: 50%;
			padding: 50rpx 50rpx 65rpx 50rpx;
			visibility: visible;
			border-radius: 35rpx;
			transition: 0.2s all;
			transform: translate(-50%, -50%) scale(0);
			width: 88%;

			&.show {
				visibility: visible;
				transform: translate(-50%, -50%) scale(1);
			}

			.h3 {
				font-weight: bold;
				font-size: 34rpx;
				text-align: center;
				line-height: 45rpx;
			}

			.button {
				display: block;
				margin: 0 auto;
				padding: 0;
				position: relative;
				width: 80%;
				background: $bodyBackgroundLine;
				border-radius: 100rpx;
				color: #FFF;
				font-weight: bold;
				font-size: 33rpx;
				text-align: center;
				height: 95rpx;
				line-height: 95rpx;
				margin-top: 50rpx;
			}

			.button:active {
				opacity: 0.8;
			}

			.button image {
				display: inline-block;
				vertical-align: middle;
				margin-top: -4rpx;
				width: 45rpx;
				margin-right: 18rpx;
			}
		}
	}
</style>
