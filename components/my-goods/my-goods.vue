<template>
	<view class="goodsItem">
		<!-- 左侧图片 -->
		<view class="img">
			<image :src="goods.goods_small_logo || defaultPic" mode=""></image>
		</view>
		<!-- 右侧内容 -->
		<view class="content">
			<!-- 标题 -->
			<view class="title">{{goods.goods_name}}</view>
			<!-- 价格 -->
			<view class="price">￥ {{goods.goods_price | toFix}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			goods:{
				type:Object,
				default:{}
			}
		},
		data() {
			return {
				// 默认商品图片
				defaultPic:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		filters:{
			toFix(price){
				return Number(price).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
.goodsItem{
	display: flex;
	padding: 10px 5px;
	border-bottom: 1px solid #f0f0f0;
	.img {
		margin-right: 5px;
		image{
			width: 100px;
			height: 100px;
			display: block;
		}
	}
	.content{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.title{
			font-size: 13px;
		}
		.price{
			font-size: 16px;
			color: #c00000;
		}
	}
}
</style>
