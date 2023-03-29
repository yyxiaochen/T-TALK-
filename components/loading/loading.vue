<template>
	<view class="load">
		<view class="loadLayer">
			<text></text>
			<text></text>
			<text></text>
			<text></text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	.load{
		position:relative;
		min-height:350rpx;
		.loadLayer {
			position: absolute;
			z-index: 98;
			top: calc(50% + 5px);
			left: 50%;
			text-align: center;
			transform: translate(-50%, -50%);
			text {
				display: inline-block;
				width: 6px;
				height: 100%;
				border-radius: 4px;
				margin:0 3px;
				background: $background;
				animation: loads 1.04s ease infinite;
				&:nth-child(2) {
					animation-delay: 0.13s;
				}
				&:nth-child(3) {
					//animation-delay: 0.26s;
				}
				&:nth-child(4) {
					animation-delay: 0.39s;
				}
			}
			@keyframes loads {
				0%, 100% {
					height: 10px;
				}
				50% {
					height: 27px;
					margin-top: -20px;
					opacity: 0.7;
				}
			}
		}
	}
</style>
