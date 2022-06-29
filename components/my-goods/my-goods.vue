<template>
	<!-- goodsItem 是遍历出来的单个商品 -->
	<!-- 公共组件 -->
	<view class="goodsItem">
		<!-- 左侧图片 -->
		<view class="img">
			<radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClick"></radio>
			<image :src="goods.goods_small_logo || defaultPic" mode=""></image>
		</view>
		<!-- 右侧内容 -->
		<view class="content">
			<!-- 标题 -->
			<view class="title">{{goods.goods_name}}</view>
			<!-- 价格和数量 -->
			<view class="priceAndNum">
				<view class="price">￥ {{goods.goods_price | toFix}}</view>
				<uni-number-box :min="1" :value="goods.goods_count" v-if="showNumBox" @change="changeHandler" ></uni-number-box>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			goods:{
				type:Object,
				default:{}
			},
			showRadio:{
				type:Boolean,
				default:false
			},
			showNumBox:{
				type:Boolean,
				default:false
			}
		},
		filters:{
			toFix(price){
				return Number(price).toFixed(2)
			}
		},
		data() {
			return {
				// 默认商品图片
				defaultPic:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		methods:{
			// 公共组件,一般不自己处理业务,emit出去,给相应页面自己处理
			// 修改商品状态
			radioClick(){
				this.$emit('radioChange',this.goods.goods_id)
			},
			// numBox数值改变
			changeHandler(value){
				this.$emit('numChange',{id:this.goods.goods_id,num:value})
			}
		},
		
	}
</script>

<style lang="scss">
.goodsItem{
	display: flex;
	padding: 10px 5px;
	border-bottom: 1px solid #f0f0f0;
	.img {
		margin-right: 5px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		image{
			width: 100px;
			height: 100px;
			display: block;
		}
	}
	.content{
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.title{
			font-size: 13px;
		}
		.priceAndNum{
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.price{
				font-size: 16px;
				color: #c00000;
			}
		}
		
	}
}
</style>
