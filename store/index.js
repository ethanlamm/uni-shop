import Vue from 'vue'
import Vuex from 'vuex'

// 引入cart仓库
import cart from './cart.js'
// 引入address仓库
import userInfo from './userInfo.js'
Vue.use(Vuex)

const store=new Vuex.Store({
	modules:{cart,userInfo}
})

export default store