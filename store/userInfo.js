export default {
	namespaced:true,
	
	mutations:{
		// 更新地址
		updateAddress(state,address){
			state.address=address
			// 本地存储
			if(JSON.stringify(address)=='{}') return
			this.commit('userInfo/saveAddress')
		},
		// 将地址存储到本地
		saveAddress(state){
			uni.setStorageSync('address',JSON.stringify(state.address))
		},
		// 更新用户信息
		updateUserInfo(state,succ){
			state.userInfo=succ.userInfo
			// 存储到本地
			this.commit('userInfo/saveUserInfo')
		},
		// 将用户信息存储到本地
		saveUserInfo(state){
			uni.setStorageSync('userInfo',JSON.stringify(state.userInfo))
		},
		// 更新token
		updateToken(state,token){
			state.token=token
			// 存储到本地
			if(token=='') return
			this.commit('userInfo/saveToken')
		},
		// 将token存储到本地
		saveToken(state){
			uni.setStorageSync('token',state.token)
		},
		// 重定向
		updateRedirectInfo(state,info){
			state.redirectInfo=info
		}
	},
	
	state:()=>({
		address:JSON.parse(uni.getStorageSync('address') || '{}'),
		token:uni.getStorageSync('token') || '',
		userInfo:JSON.parse(uni.getStorageSync('userInfo') || '{}'),
		
		// 重定向{ openType, from }
		redirectInfo:null
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