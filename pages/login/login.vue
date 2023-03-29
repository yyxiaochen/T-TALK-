<template>
	<view class="login">
		<view class="main">
			<image src="../../static/img/logo.png" class="logo" mode="heightFix"></image>
			<!-- #ifdef MP -->
			<button class="btn" hover-class="none" open-type="getUserInfo" @getuserinfo="getuserinfo">
				<image src="../../static/img/wx.png" mode="widthFix"></image>微信登录
			</button>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<button class="btn" hover-class="none" @tap="getuserinfo">
				<image src="../../static/img/wx.png" mode="widthFix"></image>微信登录
			</button>
			<!-- #endif -->
			<view class="userBook">登录享受更多权益</view>
		</view>
		<bind-mobile ref="bind-mobile" :smallCode="smallCode"></bind-mobile>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				smallCode: "", //微信小程序授权code
			}
		},
		methods: {
			//设置微信小程序的 code
			setLoginCode(call) {
				var _this = this;
				_this.smallCode = "";
				uni.login({
					success(res) {
						if (res.code) {
							_this.smallCode = res.code;
							call && call();
						} else {
							_this.app.toast("微信登录失败:wx.login.code");
						}
					},
					fail() {
						_this.app.toast("微信登录失败:wx.login.fail");
					}
				});
			},

			//获取微信信息、拿到信息后调用接口去授权
			getuserinfo(e) {
				var _this = this;
				// #ifdef MP
				if (e.detail.userInfo) {
					if (_this.smallCode) {
						_this.app.showLoading();
						uni.checkSession({
							success() {
								_this.login(e.detail);
							},
							fail() {
								_this.setLoginCode();
								_this.app.hideLoading();
								_this.app.toast("停留该页面已久，请重新点击登录");
							}
						});
					} else {
						_this.app.toast("正在获取code中,请稍后..");
					}
				}
				// #endif

				// #ifndef MP
				var redirect_uri = encodeURIComponent(this.app.host + location.pathname + location.search);
				location =
					`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx06394c336ea10e41&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
				// #endif
			},
			
			login(data) {
				var _this = this;
				// #ifdef MP
				_this.app.ajax({
					url: "login/applet",
					load: true,
					method: "post",
					data: {
						encryptedData: data.encryptedData,
						code: _this.smallCode,
						iv: data.iv,
						i: uni.getStorageSync("inviteId") || "",
					},
					success: function(res) {
						if(res.data.to_bind){
							//没有绑定手机
							_this.app.setUserInfo(res.data);
							_this.setLoginCode();
							_this.$refs['bind-mobile'].open();
						}else{
							_this.app.loginSuccess(res.data);
						}
					},
					error: function(res) {
						_this.setLoginCode();
						_this.app.toast(res.msg);
					}
				});
				// #endif

				// #ifndef MP
				_this.app.ajax({
					url: "login/index",
					load: true,
					data: {
						code: data.code,
						i: uni.getStorageSync("inviteId") || "",
					},
					method: "post",
					success: function(res) {
						_this.app.toast(res.msg);
						_this.app.loginSuccess(res.data);
					},
					error: function(res) {
						_this.app.alert({
							content: res.msg,
							success: function() {
								location = location.pathname;
							}
						})
					},
				});
				// #endif
			},


		},
		onShow(){
			// #ifdef MP
			this.setLoginCode();
			// #endif
		},
		onLoad(e) {
			//说明是微信授权后跳转到本页面的。
			e.code && this.login({code: e.code});
		},
	}
</script>

<style lang="scss" scoped>
	.login {
		height: 100vh;
		background: #FFF;

		.main {
			padding: 110.0rpx 0;

			.logo {
				display: block;
				margin: 0px auto;
				height: 165rpx;
				border-radius: 35rpx;
			}

			.btn {
				width: 82%;
				margin: 0px auto;
				display: block;
				font-weight: bold;
				text-align: center;
				font-size: 34rpx;
				line-height: 100rpx;
				height: 100rpx;
				color: #FFF;
				border-radius: 100rpx;
				margin-top: 150rpx;
				background: $bodyBackgroundLine;

				&:active {
					opacity: 0.7;
				}

				image {
					vertical-align: middle;
					margin-top: -2px;
					width: 47rpx;
					margin-right: 20rpx;
				}
			}

			.userBook {
				text-align: center;
				width: 82%;
				margin: 0px auto;
				color: #7e7e7e;
				font-size: 29rpx;
				line-height: 50rpx;
				margin-top: 40rpx;
			}

			.otherLogin {
				text-align: center;
				margin-top: 220.0rpx;

				.li {
					color: #999;
					display: inline-block;
					font-size: 26rpx;
					text-align: center;
					margin: 0 35rpx;

					image {
						display: block;
						width: 80rpx;
						height: 80rpx;
						margin: 0 auto;
						margin-bottom: 20rpx;
					}
				}
			}
		}
	}
</style>
