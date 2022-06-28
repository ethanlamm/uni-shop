<template>
	<view>
		<!-- 搜索 -->
		<view class="searchContainer">
			<uni-search-bar showInit="true" showSyncInit="true" radius="100" placeholder="请输入搜索内容" clearButton="auto"
			 cancelButton="none" @input="input"></uni-search-bar>
		</view>
		
		<!-- 搜索建议列表 -->
		<view class="suggestionsContainer" v-if="searchSuggestions.length!=0">
			<view class="suggestItem" v-for="(suggest,index) in searchSuggestions" :key="index" @click="gotoGoodsDetail(suggest)">
				<view class="content">{{suggest.goods_name}}</view>
				<uni-icons type="forward" size="16"></uni-icons>
			</view>
		</view>
		
		<!-- 历史记录 -->
		<view class="historyContainer" v-else>
			<view class="title">
				<text>搜索历史</text>
				<uni-icons type="trash-filled" size="17" @click="clearHistory"></uni-icons>
			</view>
			<view class="list">
				<uni-tag :text="history" v-for="(history,index) in historylist" :key="index" @click="gotoGoodsList(history)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 防抖
				timer: null,
				keyword: '',
				// 搜索建议列表
				searchSuggestions: [],
				// 历史记录
				historylist:[]
				// historylist:JSON.parse(uni.getStorageSync('history')) || []
			};
		},
		onLoad() {
			this.historylist=JSON.parse(uni.getStorageSync('history')) || []
		},
		methods: {
			// 获取搜索建议列表
			async getSearchSuggestions(kw) {
				if (kw == '') {
					// 清空建议列表
					this.searchSuggestions = []
					return
				}
				let {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch', {query: kw})
				if (res.meta.status != 200) return uni.$showMsg()
				this.searchSuggestions = res.message
				// 将关键词加入搜索历史列表
				this.saveHistory(kw)
			},
			// 输入
			input(e) {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					let kw = e.value.trim()
					this.getSearchSuggestions(kw)
				}, 500)
			},
			// 跳转至商品详情页
			gotoGoodsDetail(goods){
				uni.navigateTo({
					url:`/subpkg/goods_detail/goods_detail?goods_id=${goods.goods_id}`
				})
			},
			// 保存历史记录
			saveHistory(kw){
				// 去重
				let index=this.historylist.indexOf(kw)
				if(index!=-1){
					this.historylist.splice(index,1)
				}
				// 最新值在第一个
				this.historylist.unshift(kw)
				// 本地存储
				uni.setStorageSync('history',JSON.stringify(this.historylist))
			},
			// 清空搜索记录
			clearHistory(){
				this.historylist=[]
				uni.removeStorageSync('history');
			},
			// 点击历史记录,跳转至商品列表页
			gotoGoodsList(history){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?query='+history
				})
			}
		}
	}
</script>

<style lang="scss">
	// 搜索
	.searchContainer {
		position: sticky;
		top: 0;
		z-index: 999;

		// 深度选择器:
		// 1)原生css: >>> 子组件中的类名
		// 2)less: /deep/ 子组件中的类名
		// 3)sass: :v-deep 子组件中的类名
		// 4)其他格式: ::v-deep 子组件中的类名
		// 注意:要加上 !important
		::v-deep .uni-searchbar {
			background-color: #c00000 !important;
		}
	}
	// 建议列表
	.suggestionsContainer{
		padding: 0 5px;
		.suggestItem{
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			.content{
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}
	// 历史记录
	.historyContainer{
		padding: 0 5px;
		.title{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			border-bottom: 1px solid #efefef;
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			padding-left: 5px;
			.uni-tag{
				margin: 5px 5px 0 0;
			}
		}
	}
</style>
