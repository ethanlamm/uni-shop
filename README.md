uni-app

仅实现了基础功能：加入购物车，获取收货地址，一键登录(仅微信小程序)等......

登录功能：由于请求地址权限问题，未能返回一个有效的token，源码中模拟了一个token(注意：是非有效的token，仅用于登录时验证是否有token)

结算功能：由于请求地址权限问题，未能返回一个有效的订单预支付对象(payInfo)，但代码逻辑均正确，不需要修改

另：由于开发的需要，结算时，可在my-settle组件中将价格设定为 order_price : 0.001，源码已将此行代码注释，若需要可打开。


