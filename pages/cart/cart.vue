<template>
	<view>
		<!-- 地址 -->
		<my-address></my-address>
		
		<!-- 标题 -->
		<view class="cartTile">
			<uni-icons type="shop" size="18"></uni-icons>
			<text class="text">购物车</text>
		</view>
		
		<!-- 商品列表区 -->
		<!-- 滑动删除效果 -->
		<uni-swipe-action>
			<block v-for="(goods,index) in cart" :key="index">
				<uni-swipe-action-item :options="options" @click="onClick(goods)">
					<my-goods :goods="goods" :showRadio="true" :showNumBox="true" @radioChange="radioChangeHandler" @numChange="numChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
	</view>
</template>

<script>
	// mixins(混入)--即js代码相同的部分抽离,然后 mixins:[....] 使用
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {mapState} from 'vuex'
	export default {
		mixins:[badgeMix],
		computed:{
			...mapState('cart',['cart'])
		},
		data() {
			return {
				// 官网文档更新，options改为right-options(数组或对象类型)
				// 但这个版本的组件还是旧的,因此用options(数组类型)
				options:[
					{
						text:'删除',
						style:{
							backgroundColor:'#c00000'
						}
					}
				]
			};
		},
		methods:{
			// 商品状态改变
			radioChangeHandler(goods_id){
				this.$store.commit('cart/updateGoodsState',goods_id)
			},
			// 商品数量改变
			numChangeHandler(changeObj){
				this.$store.commit('cart/updateGoodsNum',changeObj)
			},
			// 删除商品
			onClick(goods){
				this.$store.commit('cart/deleteGoods',goods.goods_id)
			}
		}
	}
</script>

<style lang="scss">
.cartTile {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  .text {
    margin-left: 10px;
  }
}
</style>
