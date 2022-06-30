<template>
	<view class="loginContainer">
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
		 <view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		computed:{
			...mapState('userInfo',['redirectInfo'])
		},
		data() {
			return {
				
			};
		},
		methods:{
			// getUserInfo(){
			// 	uni.getUserProfile({desc:'login'})
			// 	.then(succ=>{
			// 		if(succ[0]!=null) return uni.$showMsg('您取消了登录授权')
			// 		this.$store.commit('userInfo/updateUserInfo',succ[1])
			// 		this.getToken(succ[1])
			// 	})
			// 	.catch(err=>console.log(err))
			// },
			// 文档中表明'该API--uni.getUserProfile暂不支持在事件中使用异步操作',但实际操作可以
			// 每次请求都会弹出授权窗口，用户同意后返回 userInfo
			async getUserInfo(){
				let res=await uni.getUserProfile({desc:'login'})
				// console.log(res);  // 这是成功的结果
				if(res[0]!=null) return uni.$showMsg('您取消了登录授权')
				
				// 将成功返回结果存储到vuex中
				this.$store.commit('userInfo/updateUserInfo',res[1])
				// 获取token
				this.getToken(res[1])
			},
			// // 获取token
			async getToken(info){
				// 微信登录在未配置onlyAuthorize的情况下，调用uni.login接口用户登录凭证(code)不返回
				// 依据文档进行配置
				let res=await uni.login()
				// console.log(info);
				// console.log(res);
				if(res[0]!=null) return uni.$showMsg('登陆失败！请稍后再试')
				// 整理参数
				let query={
					code:res[1].code,
					encryptedData:info.encryptedData,
					iv:info.iv,
					rawData:info.rawData,
					signature:info.signature
				}
				// 换取token
				// 接口问题：只有被管理员配置为小程序的开发者以后，学生才能调用成功登录，支付这些特殊的接口。
				// 而且这个开发者权限人数只有几十个，无法给各位学生分配权限，因此会调用失败,返回400
				// let {data:loginResult}=await uni.$http.post('/api/public/v1/users/wxlogin',query)
				// console.log(loginResult);
				// if(loginResult.meta.status!=200) return uni.$showMsg('登录失败！')
				
				// 模拟token数据：Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo
				let token='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
				if(!token) return uni.$showMsg('登录失败！')
				uni.$showMsg('登录成功！')
				// 将token存储到vuex
				this.$store.commit('userInfo/updateToken',token)
				
				// 判断是否要重定向跳转
				if(this.redirectInfo && this.redirectInfo.openType=='switchTab'){
					uni.switchTab({
						url:this.redirectInfo.from,
						complete: () => {
							// 将重定向重置为空
							this.$store.commit('userInfo/updateRedirectInfo',null)
						}
					})
				}
				
				
			},
			
			
		}
	}
</script>

<style lang="scss">
.loginContainer {
  // 登录盒子的样式
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;

  // 绘制登录盒子底部的半椭圆造型
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }

  // 登录按钮的样式
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #c00000;
  }

  // 按钮下方提示消息的样式
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>
