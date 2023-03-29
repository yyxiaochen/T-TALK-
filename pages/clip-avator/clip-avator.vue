<template>
	<view class="content flex">
		<view v-html="cssStyle"></view>
		<view class="cropper-wrapper flex">
			<canvas
				class="cropper"
				disable-scroll="true"
				@touchstart="touchStart"
				@touchmove="touchMove"
				@touchend="touchEnd"
				canvas-id="cropper"
			></canvas>
		</view>
		<view class="cropper-buttons">
			<view class="flex">
				<view class="upload" @tap="back">取消选择</view>
				<view class="getCropperImage" @tap="getCropperImage">确定</view>
			</view> 
			<footer-bar></footer-bar>
		</view>
	</view>
</template>

<script>
	import weCropper from '../../static/js/weCropper';
	const device = uni.getSystemInfoSync();
	export default {
		data() {
			return {
				cssStyle:"",
				cropperOpt: {
					id: 'cropper',
					scale: 2.5,
					zoom: 8,
					height:device.windowHeight - 50,
					width:device.windowWidth,
					cut: {
						x: (device.windowWidth - (device.windowWidth * 0.7)) / 2,
						y: ((device.windowHeight - 50) - (device.windowWidth * 0.7)) / 2,
						width: device.windowWidth * 0.7,
						height: device.windowWidth * 0.7
					}
				},
				weCropper: ''
			};
		},
		methods: {
			back() {
				this.app.goBack();
			},
			touchStart(e) {
				this.weCropper.touchStart(e);
			},
			touchMove(e) {
				this.weCropper.touchMove(e);
			},
			touchEnd(e) {
				this.weCropper.touchEnd(e);
			},
			convertBase64UrlToBlob(dataURI, type) {
				var binary = atob(dataURI.split(',')[1]);
				var array = [];
				for (var i = 0; i < binary.length; i++) {
					array.push(binary.charCodeAt(i));
				}
				return new Blob([new Uint8Array(array)], { type: type }, { filename: '1111.jpg' });
			},
			blobToDataURL(blob) {
				var a = new FileReader();
				a.readAsDataURL(blob); //读取文件保存在result中
				a.onload = function(e) {
					var getRes = e.target.result; //读取的结果在result中
					console.log(getRes);
				};
			},
			getCropperImage() {
				let _this = this;
				//let pathurl = url + '/user/upload';上传服务器地址
				this.weCropper.getCropperImage(avatar => {
					if (avatar) {
						//  获取到裁剪后的图片
						
						_this.app.ajax({
						    url:"user/upload_avatar_64",
						    method:"post",
						    load:true,
							data:{
								avatar:avatar,
							},
						    success:function(res){
						        _this.app.alert({
									content:res.msg,
									success:function(){
										_this.app.reshMyInfo();
										_this.app.goBack();
									}
								})
						    },
						});
					} else {
						console.log('获取图片失败，请稍后重试');
					}
				});
			},
			uploadTap() {
				const self = this;

				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success(res) {
						let src = res.tempFilePaths[0];
						//  获取裁剪图片资源后，给data添加src属性及其值

						self.weCropper.pushOrign(src);
					}
				});
			}
		},
		onLoad(option) {
			// do something
			const cropperOpt = this.cropperOpt;
			const src = option.src;
			if (src) {
				Object.assign(cropperOpt, {
					src
				});

				this.weCropper = new weCropper(cropperOpt)
				.on('ready', function(ctx) {})
				.on('beforeImageLoad', ctx => {
					uni.showToast({
						title: '上传中',
						icon: 'loading',
						duration: 3000
					});
				})
				.on('imageLoad', ctx => {
					uni.hideToast();
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	.content {
		background: rgba(255, 255, 255, 1);
		height:100vh;
		flex-direction: column;
		.cropper-wrapper {
			position: relative;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			background-color: #F0F0F0;
			flex:1;
			height:0;
			.cropper{
				flex:1;
				width:100%;
				height:0;
			}
		}
		.cropper-buttons {
			background-color: rgba(0, 0, 0, 0.95);
			width: 100%;
			padding-bottom: env(safe-area-inset-bottom);
			.flex{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				color: #04b00f;
				height: 50px;
				line-height: 50px;
				&>view{
					width: 50%;
					font-size:30rpx;
					text-align: center;
				}
			}
		}
	}
</style>