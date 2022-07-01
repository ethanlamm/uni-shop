<template>
	<view class="userInfoContainer">
		<!-- 头像和昵称 -->
		<view class="top">
			<image :src="userInfo.avatarUrl" mode="" class="avatar"></image>
			<view class="nickname">{{userInfo.nickName}}</view>
		</view>
		
		<!-- 面板区域 -->
		<view class="panelContainer">
			<!-- 第一个面板 -->
			<view class="panel">
				<view class="panelBody">
					<view class="item">
						<text>8</text>
						<text>收藏的店铺</text>
					</view>
					<view class="item">
						<text>8</text>
						<text>收藏的商品</text>
					</view>
					<view class="item">
						<text>8</text>
						<text>关注的商品</text>
					</view>
					<view class="item">
						<text>8</text>
						<text>足迹</text>
					</view>
				</view>
			</view>
			<!-- 第二个面板 -->
			<view class="panel">
				<view class="paneltitle">我的订单</view>
				<view class="panelBody">
					<view class="item">
						<image src="/static/order_icons/topay.png" class="icons"></image>
						<text>待付款</text>
					</view>
					<view class="item">
						<image src="/static/order_icons/toreceive.png" class="icons"></image>
						<text>待收货</text>
					</view>
					<view class="item">
						<image src="/static/order_icons/refund.png" class="icons"></image>
						<text>退款/退货</text>
					</view>
					<view class="item">
						<image src="/static/order_icons/orderlist.png" class="icons"></image>
						<text>全部订单</text>
					</view>
				</view>
			</view>
			<!-- 第三个面板 -->
			<view class="panel">
				<view class="panelListItem">
					<text>收货地址</text>
					<uni-icons type="forward" size="15"></uni-icons>
				</view>
				<view class="panelListItem">
					<text>联系客服</text>
					<uni-icons type="forward" size="15"></uni-icons>
				</view>
				<view class="panelListItem" @click="logout">
					<text>退出登录</text>
					<uni-icons type="forward" size="15"></uni-icons>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		computed:{
			...mapState('userInfo',['userInfo'])
		},
		data() {
			return {
				
			};
		},
		methods:{
			async logout(){
				let res=await uni.showModal({
					title:'提示',
					content:'确认退出登陆吗？'
				}).catch(err=>err)
				if(res[1] && res[1].confirm){
					try{
						// 清空数据 userInfo token address
						uni.removeStorageSync('userInfo')
						
						uni.removeStorageSync('address')
						// 这是购物车页面按钮和地址的切换要用到adress
						this.$store.commit('userInfo/updateAddress',{})
						
						uni.removeStorageSync('token')
						// 这是login和userInfo页面转换要用到token
						this.$store.commit('userInfo/updateToken','')
					}catch(e){
						//TODO handle the exception
						console.log(e);
					}
				}
			}
		}
	}
</script>

<style lang="scss">
.userInfoContainer{
	height: 100%;
	background-color: #f4f4f4;
	
	// 头像和昵称
	.top{
	    height: 400rpx;
	    background-color: #c00000;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	
	    .avatar {
	      display: block;
	      width: 90px;
	      height: 90px;
	      border-radius: 50%;
	      border: 2px solid white;
	      box-shadow: 0 1px 5px black;
	    }
	
	    .nickname {
	      color: white;
	      font-weight: bold;
	      font-size: 16px;
	      margin-top: 10px;
	    }
	}
	
	// 面板区域
	.panelContainer{
		padding: 0 10px;
		position: relative;
		top: -10px;
		
		.panel{
			background-color: white;
			border-radius: 3px;
			margin-bottom: 8px;
			
			// 标题	
			.paneltitle {
			    line-height: 45px;
			    padding-left: 10px;
			    font-size: 15px;
			    border-bottom: 1px solid #f4f4f4;
			}
			
			// body部分
			.panelBody{
				display: flex;
				justify-content: space-around;
				
				.item{
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-around;
					font-size: 13px;
					padding: 10px 0;
					
					.icons{
						width: 32px;
						height: 32px;
					}
				}
			}
			
			// 列表区
			.panelListItem{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 10px;
				height: 45px;
				font-size: 15px;
			}
		}
	}
}
</style>
