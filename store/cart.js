export default {
	namespaced:true,
	
	mutations:{
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
		}
	},
	
	state:()=>({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart:[]
	}),
	
	getters:{}
}