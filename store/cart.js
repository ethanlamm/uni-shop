export default {
	namespaced:true,
	
	mutations:{
		// 商品加入购物车
		addToCart(state,goods){
			// 将商品加入购物车列表cart,分情况:1)商品不存在,直接添加  2)商品存在,数量增加
			// 每个商品的id是唯一的，find返回第一个符合条件的元素，否则返回undefined
			let findResult=state.cart.find(item=>item.goods_id==goods.goods_id)
			if(!findResult){
				// 不存在
				state.cart.push(goods)
			}else{
				// 存在
				findResult.goods_count++
			}
			this.commit('cart/saveCart')
		},
		// 删除商品
		deleteGoods(state,id){
			state.cart=state.cart.filter(item=>item.goods_id!=id)
			this.commit('cart/saveCart')
		},
		// 本地存储商品
		saveCart({cart}){
			uni.setStorageSync('cart',JSON.stringify(cart))
		},
		// 更新商品选中状态(单个)
		updateGoodsState({cart},goods_id){
			let findResult=cart.find(item=>item.goods_id==goods_id)
			if(findResult){
				findResult.goods_state=!findResult.goods_state
				// 再存储
				this.commit('cart/saveCart')
			}
		},
		// 更新商品选中状态(所有)
		updateAllGoodsState(state,newState){
			state.cart.forEach(item=>item.goods_state=newState)
			// 再存储
			this.commit('cart/saveCart')
		},
		// 更新商品数量
		updateGoodsNum({cart},{id,num}){
			let findResult=cart.find(item=>item.goods_id==id)
			if(findResult){
				findResult.goods_count=Number(num)
				// 再存储
				this.commit('cart/saveCart')
			}
		}
	},
	
	state:()=>({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart:JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	
	getters:{
		// 这里为什么是将cart本地存储,而不是直接将totalCount本地存储?
		// 因为totalCount是依赖cart计算出来的,每次刷新(重新进入小程序),cart重置,totalCount也会重置,并不能实现totalCount持久存储的效果
		// 所以,将源头cart本地存储才是正确的
		
		// 修改---代表商品种类的数量，不是所有商品的数量
		totalCount(state){
			return state.cart.length
			// let sum=0
			// cart.forEach(item=>{
			// 	if(item.goods_state){
			// 		// 只计算选中状态的商品
			// 		sum+=item.goods_count
			// 	}
			// })
			// return sum
		},
		
		// 已勾选的所有商品的总数
		checkedCount(state){
			return state.cart.filter(item=>item.goods_state==true).reduce((sum,Item)=>sum+=Item.goods_count,0)
		},
		
		// 全选的勾选状态
		isAllChecked(state){
			return state.cart.some(item=>item.goods_state==false)
		},
		
		// 已勾选商品的总价格
		checkedGoodsAmount(state){
			let sum=0
			state.cart.forEach(item=>{
				if(item.goods_state){
					sum+=item.goods_price*item.goods_count
				}
			})
			return sum.toFixed(2)
		}
	}
}