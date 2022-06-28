<template>
	<view class="goodslistContainer">
		<block v-for="(goods,index) in goodslist" :key="index">
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
					<view class="price">￥ {{goods.goods_price}}</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数
				queryObj:{
					query:'',
					cid:'',
					pagenum:1,
					pagesize:10
				},
				// 总页数
				total:0,
				goodslist:[],
				// 默认商品图片
				defaultPic:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		onLoad(options) {
			this.queryObj.query=options.query||''
			this.queryObj.cid=options.cid||''
			this.getGoodslist()
		},
		methods:{
			// 获取商品列表
			async getGoodslist(){
				let {data:res}=await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
				if(res.meta.status!==200) return uni.$showMsg()
				this.total=res.message.total
				this.goodslist=res.message.goods
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
