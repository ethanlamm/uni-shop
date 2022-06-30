<template>
	<view class="addressContainer">
		<!-- 按钮 -->
		<view class="addressChoose" v-if="!isAddressExist">
			 <button type="primary" size="mini" @click="chooseAddress">请选择收货地址+</button>
		</view>
		
		<!-- 收货地址 -->
		<view class="adderssInfo" v-else @click="chooseAddress">
			<view class="row1">
				<view class="receiver">收货人：{{address.userName}}</view>
				<view class="phone">
					<view>电话：{{address.telNumber}}</view>
					<uni-icons type="forward"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<view class="address">
					<view class="label">收货地址：</view>
					<view class="content">{{addr}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapGetters} from 'vuex'
	export default {
		computed:{
			...mapState('userInfo',['address']),
			...mapGetters('userInfo',['addr'])
		},
		watch:{
			address:{
				immediate:true,
				handler(newValue){
					if(JSON.stringify(newValue)=='{}'){
						// 地址不存在,显示按钮
						this.isAddressExist=false
					}else{
						// 地址存在,显示地址
						this.isAddressExist=true
					}
				}
			}
		},
		data() {
			return {
				// 默认不存在
				isAddressExist:false
			};
		},
		methods:{
			// 获取地址
			async chooseAddress(){
				let [err,succ]=await uni.chooseAddress().catch(err=>err)
				// console.log(succ);
				if(err==null && succ.errMsg=='chooseAddress:ok'){
					// address不在这里存储到本地,而是放到vuex中再存储到本地,因为my组件也要用到address--地址的管理
					this.$store.commit('userInfo/updateAddress',succ)
				}
			},
		}
	}
</script>

<style lang="scss">
.addressContainer{
	border-bottom: 5px solid #c00000;
	
	// 按钮
	.addressChoose{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 90px;
	}
	
	// 收货地址信息
	.adderssInfo{
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 12px;
		height: 90px;
		padding: 0 5px;
		
		.row1{
			display: flex;
			justify-content: space-between;
			
			.phone{
				display: flex;
			}
		}
		
		.row2{
			margin-top: 10px;
			
			.address{
				display: flex;
				
				.label{
					white-space: nowrap;
				}
			}
		}
	}
}
</style>
