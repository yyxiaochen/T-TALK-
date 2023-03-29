<template>
	<view>
		<image src="../../static/img/step.png" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
			}
		}, 
		methods: {
			

		},
		onShow(){

		},
		mounted(){

		},
	}
</script>

<style lang="scss" scoped>
	image{
		display: block;
		width:100%;
	}
</style>
