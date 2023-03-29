<!-- 既占了位，也固定在头部的头部 -->
<template>
	<view class="header">
		<div class="placeholder" v-if="fixed">
			<status-bar></status-bar>
			<slot name="content"></slot>
		</div>
		<div class="main" :style="{background:background}">
			<status-bar></status-bar>
			<slot name="content"></slot>
		</div>
	</view>
</template>

<script>
	export default {
		props:{
			background:{
				type:String,
				default:"#FFF"
			},
			fixed:{
				type:Boolean,
				default:true,
			},
		},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
			}
		},
		mounted(){

		}
	}
</script>

<style lang="scss" scoped>
	.header{
		.placeholder{
			opacity: 0;
		}
		.main{
			position:fixed;
			top:0;
			left:0;
			right:0;
			z-index:999;
		}
	}
</style>