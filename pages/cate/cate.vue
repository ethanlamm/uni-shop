<template>
	<view>
		<!-- 搜索 -->
		<my-search @click.native="goSearch"></my-search>
		<!-- 商品区 -->
		<view class="scrollViewContainer">
			<!-- 左侧 -->
			<scroll-view class="leftScrollView" scroll-y="true" :style="{height:height+'px'}">
				<block v-for="(cate,index) in catelist" :key="index">
					<view :class="['leftScrollViewItem',active==index?'active':'']" @click="activeChange(index)">{{cate.cat_name}}</view>
				</block>
				
			</scroll-view>
			<!-- 右侧 -->
			<scroll-view class="rightScrollView" scroll-y="true" :style="{height:height+'px'}" :scroll-top="scrollTop">
				<view class="catelv2" v-for="(lv2,index) in catelevel2" :key="lv2.cat_id">
					<!-- 二级分类标题 -->
					<view class="catelv2-title">/ {{lv2.cat_name}} /</view>
					<!-- 三级分类 -->
					<view class="catelv3">
						<view class="lv3Item" v-for="(lv3,index) in lv2.children" :key="lv3.cat_id" @click="gotoGoodslist(lv3)">
							<image :src="lv3.cat_icon"></image>
							<text>{{lv3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins:[badgeMix],
		data() {
			return {
				// 自适应高度
				height:0,
				active:0,
				scrollTop:0,
				// 总分类(一级分类)
				catelist:[],
				// 二级分类
				catelevel2:[]
			};
		},
		onLoad() {
			// 获取屏幕高度
			const info=uni.getSystemInfoSync()
			this.height=info.windowHeight-50
			this.getCatelist()
		},
		methods:{
			// 获取左侧分类列表数据
			async getCatelist(){
				let {data:res}=await uni.$http.get('/api/public/v1/categories')
				if(res.meta.status!=200) return uni.$showMsg()
				// 处理三级分类数据
				res.message&&res.message.forEach(catelv1=>{
					catelv1.children&&catelv1.children.forEach(catelv2=>{
						catelv2.children&&catelv2.children.forEach(catelv3=>{
							catelv3.cat_icon=catelv3.cat_icon.replace('dev','web')
						})
					})
				})
				// 总分类
				this.catelist=res.message
				
				// 二级分类(首次加载第一个)
				this.catelevel2=res.message[0].children
			},
			// 左侧导航点击事件
			activeChange(index){
				this.active=index
				// 切换时,为二级分类重新赋值
				this.catelevel2=this.catelist[index].children
				// 将scrollTop重置
				this.scrollTop=this.scrollTop==0?0.01:0
			},
			// 跳转商品列表页面
			gotoGoodslist(good){
				uni.navigateTo({
					url:`/subpkg/goods_list/goods_list?cid=${good.cat_id}`
				})
			},
			// 跳转至搜索页面
			goSearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
.scrollViewContainer{
	display: flex;
	// 左侧
	.leftScrollView{
		width: 120px;
		.leftScrollViewItem{
			position: relative;
			line-height: 60px;
			background-color: #f7f7f7;
			text-align: center;
			font-size: 12px;
			
			// 激活项样式
			&.active{
				background-color: #ffffff;
				
				&::before{
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					content: '';
					display: block;
					width: 3px;
					height: 30px;
					background-color: #c00000;
					
				}
			}
		}
	}
	// 右侧
	.rightScrollView{
		.catelv2{
			// 二级标题
			.catelv2-title{
				font-size: 12px;
				font-weight: bold;
				text-align: center;
				padding: 15px 0;
			}
			
			// 三级分类容器
			.catelv3{
				display: flex;
				flex-wrap: wrap;
				
				// 每个三级分类
				.lv3Item{
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 33.33%;
					margin-bottom: 10px;
					
					image{
						width: 60px;
						height: 60px;
					}
					
					text{
						font-size: 12px;
					}
				}
			}
		}
	}
}
</style>
