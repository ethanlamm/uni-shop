<template>
	<view class="myContainer">
		<my-login v-if="!isTokenExist"></my-login>
		<my-userInfo v-else></my-userInfo>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {mapState} from 'vuex'
	export default {
		mixins:[badgeMix],
		computed:{
			...mapState('userInfo',['token']),
		},
		watch:{
			token:{
				immediate:true,
				handler(newValue){
					if(newValue==''|| newValue==undefined){
						// 不存在token,显示login
						this.isTokenExist=false
					}else{
						// 存在token,显示userInfo
						this.isTokenExist=true
					}
				}
			}
		},
		data() {
			return {
				// 默认不存在token
				isTokenExist:false
			};
		}
	}
</script>

<style lang="scss">
page,.myContainer{
	height: 100%;
}
</style>
