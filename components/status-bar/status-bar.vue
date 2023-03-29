<!-- 顶部导航栏占用宽度 -->
<template>
	<!-- #ifdef APP-NVUE || APP-PLUS -->
	<view :style="{'height':systemInfo.statusBarHeight+'px'}"></view>
	<!-- #endif -->
</template>

<script>
	export default {
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
			}
		},
	}
</script>