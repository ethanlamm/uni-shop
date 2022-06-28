<template>
	<view>
		<!-- 搜索 -->
		<view class="searchContainer">
			<my-search @click.native="goSearch"></my-search>
		</view>
		<!-- 轮播图 -->
		<view>
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
				<swiper-item v-for="(item,index) in swiperlist" :key="index">
					<navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`">
						<image :src="item.image_src"></image>
					</navigator>
				</swiper-item>
		
			</swiper>
		</view>
		
		<!-- 分类导航 -->
		<view class="navContainer">
			<view class="navItem" v-for="(item,index) in navlist" :key="index" @click="navClick(item)">
				<image :src="item.image_src"></image>
			</view>
		</view>
		
		<!-- 楼层 -->
		<view class="floorContainer">
			<view class="floorItem" v-for="(item,index) in floorlist" :key="index">
				<!-- 标题 -->
				<image :src="item.floor_title.image_src" class="floorTitle"></image>
				<!-- 图片 -->
				<view class="imgBox">
					<!-- 左侧大图 -->
					<navigator class="left" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" mode="widthFix" :style="{width:item.product_list[0].image_width+'rpx'}"></image>
					</navigator>
					<!-- 右侧4张小图 -->
					<view class="right">
						<block v-for="(img,index) in item.product_list" :key="index">
							<navigator v-if="index!=0" :url="img.url">
								<image :src="img.image_src" mode="widthFix" :style="{width:img.image_width+'rpx'}"></image>
							</navigator>
						</block>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperlist:[],
				navlist:[],
				floorlist:[]
			};
		},
		onLoad() {
			this.getSwiperlist()
			this.getNavlist()
			this.getFloorlist()
		},
		methods:{
			// 获取轮播图
			async getSwiperlist(){
				let {data:res}=await uni.$http.get('/api/public/v1/home/swiperdata')
				if(res.meta.status!=200) return uni.$showMsg()
				this.swiperlist=res.message
			},
			// 获取分类导航
			async getNavlist(){
				let {data:res}=await uni.$http.get('/api/public/v1/home/catitems')
				if(res.meta.status!=200) return uni.$showMsg()
				this.navlist=res.message
			},
			// 获取楼层
			async getFloorlist(){
				let {data:res}=await uni.$http.get('/api/public/v1/home/floordata')
				if(res.meta.status!=200) return uni.$showMsg()
				// 处理数据
				res.message.forEach(floor=>{
					floor.product_list.forEach(product=>{
						product.url='/subpkg/goods_list/goods_list?'+product.navigator_url.split('?')[1]
					})
				})
				this.floorlist=res.message
			},
			// 导航点击事件--切换至分类页面
			navClick(item){
				if(item.name=='分类'){
					uni.switchTab({
						url:'/pages/cate/cate'
					})
				}
			},
			// 跳转至搜索页
			goSearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
// 搜索
	.searchContainer{
		position:sticky;
		top:0;
		z-index:999
	}
	// 轮播图
	swiper{
		height: 330rpx;
		.swiper-item,image{
			width: 100%;
			height: 100%;
		}
	}
	
	// 分类导航
	.navContainer{
		display: flex;
		justify-content: space-around;
		margin: 15px 0;
		.navItem image{
			width: 128rpx;
			height: 140rpx;
		}
	}
	
	// 楼层
	.floorContainer{
		.floorTitle{
			width: 100%;
			height: 60rpx;
		}
		.imgBox{
			display: flex;
			padding-left: 10rpx;
			.right{
				display: flex;
				flex-wrap: wrap;
				justify-content: space-around;
			}
		}
	}
</style>
