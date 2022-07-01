import Vue from 'vue'
import App from './App'

// 导入store
import store from '@/store/index.js'

// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'
// 挂载至uni上
uni.$http = $http
// 请求根路径
$http.baseUrl='https://api-ugo-web.itheima.net'
// 请求拦截器
$http.beforeRequest = function (options) {
  uni.showLoading({
  	title:'数据加载中...'
  })
  // 判断请求的是否为有权限的api接口
  if(options.url.indexOf('/my/')!=-1){
	  // 为请求头添加身份验证字段
	  options.header={
		  Authorization:store.state.userInfo.token
	  }
  }
}
// 响应拦截器
$http.afterRequest = function (res) {
  uni.hideLoading()
}
// 封装弹窗函数
uni.$showMsg=function(title='数据请求失败！',duration=1500){
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
