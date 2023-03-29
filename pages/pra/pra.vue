<template>
	<web-view :src="`${app.api}/pra.html`"></web-view>
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
	web-view{
		width:100vw;
		height:100vh;
	}
</style>
