import {mapGetters} from 'vuex'

export default {
	computed:{
		...mapGetters('cart',['totalCount'])
	},
	watch:{
		// totalCount改变,再次调用setTabbarBadge函数
		totalCount(){
			this.setTabbarBadge()
		}
	},
	onLoad(){
		this.setTabbarBadge()
	},
	methods:{
		setTabbarBadge(){
			uni.setTabBarBadge({
				index:2,
				text:this.totalCount.toString()
			})
		}
	}
}