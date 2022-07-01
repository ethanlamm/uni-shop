<template>
	<view v-if="goodsInfo.goods_name" class="goodsDetailContainer">
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true" class="swiper">
			<swiper-item v-for="(img,index) in goodsInfo.pics" :key="index">
				<image :src="img.pics_big" @click="preview(index)" class="image"></image>
			</swiper-item>
		</swiper>
		
		<!-- 商品信息区 -->
		<view class="goodsInfo">
			<view class="price">￥{{goodsInfo.goods_price}}</view>
			<view class="title">
				<view class="name">{{goodsInfo.goods_name}}</view>
				<view class="star">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<view class="freight">快递：免运费</view>
		</view>
		
		<!-- 商品详细介绍 -->
		<rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
		
		<!-- 底部商品导航 -->
		<view class="goodsNav">
			<uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	export default {
		computed:{
			...mapGetters('cart',['totalCount'])
		},
		watch:{
			// 修改购物车商品数量
			totalCount:{
				immediate: true,
				handler(newValue){
					let findResult=this.options.find(option=>option.text=='购物车')
					if(findResult){
						findResult.info=newValue
					}
				}
			}
		},
		data() {
			return {
				goodsInfo:{},
				options: [{
							icon: 'shop',
							text: '店铺',
							infoBackgroundColor:'#007aff',
							infoColor:"red"
						}, {
							icon: 'cart',
							text: '购物车',
							info: 0
						}],
				buttonGroup: [{
					      text: '加入购物车',
					      backgroundColor: '#ff0000',
					      color: '#fff'
					    },
					    {
					      text: '立即购买',
					      backgroundColor: '#ffa200',
					      color: '#fff'
					    }
					    ]
			};
		},
		onLoad(options) {
			this.getGoodsdetail(options)
		},
		methods:{
			// 获取数据
			async getGoodsdetail(queryParams){
				let {data:res}=await uni.$http.get('/api/public/v1/goods/detail',queryParams)
				if(res.meta.status!=200) return uni.$showMsg()
				// 处理数据
				res.message.goods_introduce=res.message.goods_introduce.replace(/<img /g,'<img style="display:block;" ').replace(/webp/g,'jpg')
				this.goodsInfo=res.message
			},
			// 预览图片
			preview(index){
				uni.previewImage({
					current:index,
					urls:this.goodsInfo.pics?this.goodsInfo.pics.map(pics=>pics.pics_big):[]
				})
			},
			// 点击'商店'或'购物车'
			onClick(e){
				if(e.content.text=='购物车'){
					uni.switchTab({
						url:'/pages/cart/cart'
					})
				}
			},
			// 点击'加入购物车'或'立即购买'
			buttonClick(e){
				if(e.content.text=='加入购物车'){
					// 整理商品信息
					let goods={
						goods_id:this.goodsInfo.goods_id,
						goods_name:this.goodsInfo.goods_name,
						goods_price:this.goodsInfo.goods_price,
						goods_count:1,
						goods_small_logo:this.goodsInfo.goods_small_logo,
						goods_state:true
					}
					this.$store.commit('cart/addToCart',goods)
				}
			}
		}
	}
</script>

<style lang="scss">
.goodsDetailContainer{
	padding-bottom: 50px;
	
	// 轮播图
	.swiper{
		height: 750rpx;
		
		.image{
			width: 100%;
			height: 100%;
		}
	}
	
	// 商品标题信息
	.goodsInfo{
		padding: 10px 0 10px 10px;
		
		.price{
			color: #c00000;
			font-size: 18px;
			margin: 10px 0;
		}
		.title{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.name{
				font-size: 13px;
				padding-right: 10px;
			}
			.star{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 120px;
				color: gray;
				font-size: 12px;
				border-left: 1px solid #efefef;
				
			}
		}
		.freight{
			margin: 10px 0;
			font-size: 12px;
			color: gray;
		}
	}
	
	// 底部导航
	.goodsNav{
		position: fixed;
		bottom: 0;
		width: 100%;
	}
}

</style>
