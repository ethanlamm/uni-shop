<template>
	<view class="searchContainer" :style="{backgroundColor:bgcolor}">
		<view class="search" :style="{borderRadius: radius+'px'}">
			 <icon type="search" size="18"/>
			 <text class="text">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			// 背景色
			bgcolor:{
				type:String,
				default:'#c00000'
			},
			// 圆角尺寸
			radius:{
				type:Number,
				default:18	// px
			}
		}
			
	}
</script>

<style lang="scss">
.searchContainer{
	display: flex;
	align-items: center;
	height: 50px;
	padding: 0 10px;
	.search{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 36px;
		background-color: #ffffff;
		
		.text{
			font-size: 15px;
			margin-left: 5px;
		}
	}
}
</style>
