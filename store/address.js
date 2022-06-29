export default {
	namespaced:true,
	
	mutations:{
		// 更新地址
		updateAddress(state,address){
			state.address=address
			// 本地存储
			this.commit('address/saveAddress')
		},
		// 存储到本地
		saveAddress(state){
			uni.setStorageSync('address',JSON.stringify(state.address))
		}
	},
	
	state:()=>({
		address:JSON.parse(uni.getStorageSync('address') || '{}')
	}),
	
	getters:{
		addr(state){
			if(!state.address.userName) return ''
			// 拼接完整地址
			let {address}=state
			return address.provinceName +address.provinceName + address.cityName + address.countyName + address.detailInfo
		}
	}
}