<template>
	<view class="goodslistContainer">
		<view v-for="(goods,index) in goodslist" :key="index" @click="gotoGoodsDeatil(goods)">
			<my-goods :goods="goods"></my-goods>
		</view>
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
				// 商品列表
				goodslist:[],
				// 节流阀
				isloading:false
			};
		},
		onLoad(options) {
			this.queryObj.query=options.query||''
			this.queryObj.cid=options.cid||''
			this.getGoodslist()
		},
		methods:{
			// 获取商品列表
			async getGoodslist(closePullDown){
				// 关闭节流阀
				this.isloading=true
				let {data:res}=await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
				if(res.meta.status!==200) return uni.$showMsg()
				// 新旧数据合并
				this.total=res.message.total
				this.goodslist=[...this.goodslist,...res.message.goods]
				// 关闭下来刷新
				closePullDown&&closePullDown()
				// 打开节流阀
				this.isloading=false
			},
			// 跳转至商品详情页
			gotoGoodsDeatil(goods){
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id='+goods.goods_id
				})
			}
		},
		// 触底加载
		onReachBottom() {
			// 节流请求
			if(this.isloading) return
			// 页码加一，先判断
			if(this.queryObj.pagenum*this.queryObj.pagesize>=this.total) return uni.$showMsg('已无再多商品信息')
			this.queryObj.pagenum++
			console.log(this.queryObj.pagenum);
			// 再次请求数据
			this.getGoodslist()
		},
		// 下拉刷新
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum=1
			this.total=0
			this.goodslist=[]
			this.isloading=false
			// 重新发请求(关闭下拉刷新)
			this.getGoodslist(()=>uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">

</style>
