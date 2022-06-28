import Vue from 'vue'
import Vuex from 'vuex'

// 引入cartModule
import cart from './cart.js'
Vue.use(Vuex)

const store=new Vuex.Store({
	modules:{cart}
})

export default store