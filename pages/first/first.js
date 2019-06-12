//获取应用实例
const app = getApp()
Page({ //设置fires中的值
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),//判断小程序的API，回调，参数，组件等是否在当前版本可用
    rl: '人脸注册',
    openid: '',
    session_key: '',
    code: '',
    session_key: '',
    pd: null
  },
  onLoad: function() {
    wx.getUserInfo({ //运行之前必须是授权过
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log(this.data.userInfo);
      }
    })
  },
  onShow: function() { //自动开始加载的函数
    var that = this;
    app.getcode(); //异步获取code
    wx.request({ //查看是否有重复的POENid
      url: 'http://192.168.137.109:8080/v1/open/three/manager/test2/' + app.globalData.code, //后端用户信息接
      method: "PUT",
      dataType: 'json',
      header: { //头部返回信息
        'content-type': 'application/json'
      },
      success: function(res) { //成功的时候的回调
        that.setData({
          pd: res.data //看下变变的控制台里找到这个 值进行一个小判断
        })
        if (res.data == true) { //到时候看返回值进行T/F判断
          that.setData({
            pd: true
          })
        } else {
          that.setData({
            pd: false
          })
        }
      }
    }) //请求结束
  }, //onlode over
  getUserInfo(e) { //点击按钮后授权-----只有用户第一次登录的时候才可以发现这个按钮
    app.globalData.userInfo = e.detail.userInfo
    console.log(e.detail.userInfo + "我是第一次点击后触发的按钮");
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
  },
  denglu() { //跳转登录的按钮
    wx.navigateTo({
      url: '../denglu/denglu',
    })
  },
  zhuce() { //跳转注册按钮
    wx.navigateTo({
      url: '../index/index'
    })
  },

})