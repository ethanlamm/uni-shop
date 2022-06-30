<template>
	<view class="settleContainer">
		<!-- 全选 -->
		<label class="radio">
			<radio color="#c00000" :checked="!isAllChecked" @click="radioClick"/><text>全选</text>
		</label>
		<!-- 总价 -->
		<view class="amount">
			总价：<text class="total">￥{{checkedGoodsAmount}}</text>
		</view>
		<!-- 结算按钮 -->
		<view class="settle" @click="goCheck">去结算({{checkedCount}}件)</view>
	</view>
</template>

<script>
	import {mapState,mapGetters} from 'vuex'
	export default {
		computed:{
			// checkedCount:已勾选商品的总数量
			// isAllChecked:全选状态
			// checkedGoodsAmount:已勾选商品的总价格
			...mapGetters('cart',['checkedCount','isAllChecked','checkedGoodsAmount']),
			...mapState('userInfo',['address','token'])
		},
		data() {
			return {
				second:3,
				timer:null
			};
		},
		methods:{
			// 全选状态改变
			radioClick(){
				this.$emit('allCheckedChange',this.isAllChecked)
			},
			// 去结算
			goCheck(){
				// 是否勾选了商品
				if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
				// 是否选择了地址
				if(!this.address.userName) return uni.$showMsg('请选择收货地址！')
				// 是否登录了(token)
				// if(!this.token) return uni.$showMsg('请先登录！')
				if(!this.token) return this.delayNavigate()
			},
			// 倒计时提示
			showTip(second){
				uni.showToast({
					title:`请登录后再结算! ${second} 秒后自动跳转到登录页`,
					icon:'none',
					mask:true
				})
			},
			// 延时跳转到my页面进行登录
			delayNavigate(){
				// 每次开始时,重置second
				this.second=3
				this.showTip(this.second)
				// 定时器
				this.timer=setInterval(()=>{
					this.second--
					if(this.second<=0){
						// 倒计时为零时,1)清除定时器 2)跳转至my页面 3)return后续代码不再进行
						clearInterval(this.timer)
						uni.switchTab({
							url:'/pages/my/my',
							success: () => {
								this.$store.commit('userInfo/updateRedirectInfo',{
									openType:'switchTab',
									from:'/pages/cart/cart'
								})
							}
						})
						// 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
						return
					}
					this.showTip(this.second)
				},1000)
			}
		}
	}
</script>

<style lang="scss">
.settleContainer{
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 50px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 5px;
	font-size: 14px;
	background-color: white;
	
	.radio{
		display: flex;
		align-items: center;
	}
	
	.amount{
		font-size: 16px;
		.total{
			color: #c00000;
			font-weight: bold;
		}
	}
	
	.settle{
		background-color: #c00000;
		color: white;
		font-weight: bold;
		height: 100%;
		min-width: 120px;
		line-height: 50px;
		text-align: center;
	}
}
</style>
