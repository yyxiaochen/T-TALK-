<template>
	<view>
		<placeholder-header>
			<template slot="content">
				<view class="common-header flex">
					<view class="left">
						<text class="iconfont iconxiangzuo" @click="app.goBack"></text>
					</view>
					<view class="center">
						<text class="ell">测试</text>
					</view>
					<view class="right"></view>
				</view>
			</template>
		</placeholder-header>
		
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
	
</style>
