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
			...mapState('cart',['cart']),
			...mapGetters('cart',['checkedCount','isAllChecked','checkedGoodsAmount']),
			...mapState('userInfo',['token']),
			...mapGetters('userInfo',['addr'])
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
				if(!this.addr) return uni.$showMsg('请选择收货地址！')
				// 是否登录了(token)
				// if(!this.token) return uni.$showMsg('请先登录！')
				if(!this.token) return this.delayNavigate()
				// 以上条件均符合,则进行支付
				this.payOrder()
			},
			// 支付
			async payOrder(){
				// 具体关键字段,参考请求文档
				// 1.创建订单（订单金额、收货地址、订单中包含的商品信息）--返回 订单编号
				// 1.1整理请求参数
				let orderInfo={
					// order_price:0.001,   // 开发时，可用此总价格
					order_price:this.checkedGoodsAmount,    // 订单总价格
					consignee_addr:this.addr,
					goods:this.cart.filter(item=>item.goods_state).map(item=>({
						goods_id:item.goods_id,
						goods_number:item.goods_count,
						goods_price:item.goods_price
					}))
				}
				// 1.2发请求
				let {data:res1}=await uni.$http.post('/api/public/v1/my/orders/create',orderInfo)
				if(res1.meta.status!=200) return uni.$showMsg('创建订单失败！')
				// 1.3得到订单编号
				let order_number=res1.message.order_number

				// 2.订单预支付（订单编号）--返回 订单预支付的参数对象
				// 2.1发请求
				let {data:res2}=await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder',{order_number})
				if(res2.meta.status!=200) return uni.$showMsg('预付订单生成失败！')
				// 2.2得到订单预支付对象
				let payInfo=res2.message.pay
		
				// 3.发起微信支付（订单预支付对象）--监听 success fail complete回调函数
				// 3.1 调用 uni.requestPayment() 发起微信支付
				let [err,succ]=await uni.requestPayment(payInfo)   // 将payInfo传入
				// 3.2未完成支付
				if(err) return uni.$showMsg('订单未支付！')
				// 3.3完成了支付,进一步查询支付结果--查询订单支付状态
				let {data:res3}=await uni.$http.post('/api/public/v1/my/orders/chkOrder',{order_number})
				// 3.4检测到订单未支付
				if(res3.meta.status!=200) return uni.$showMsg('订单未支付！')
				// 3.5检测到订单支付完成
				uni.showToast({
					title:'支付完成！',
					icon:'success'
				})
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
