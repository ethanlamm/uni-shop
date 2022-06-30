import {mapGetters} from 'vuex'

export default {
	computed:{
		...mapGetters('cart',['totalCount'])
	},
	watch:{
		totalCount:{
			immediate:true,
			handler(){
				this.setTabbarBadge()
			}
		}
	},
	onLoad(){
		this.setTabbarBadge()
	},
	// 再次进入
	onShow() {
		this.setTabbarBadge()
	},
	methods:{
		setTabbarBadge(){
			// 当购物车中商品数量为0时,去除徽标
			if(this.totalCount==0){
				uni.removeTabBarBadge({
					index:2
				})
				return
			}
			uni.setTabBarBadge({
				index:2,
				text:this.totalCount.toString()  // 字符串类型
			})
		}
	}
}