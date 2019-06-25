//app.js

App({
  globalData: {
    openid: '',
    code: '',
    lev: [
      '已经没有可降的了，加油啊',
      '小白',
      '书童',
      '秀才',
      '举人',
      '探花',
      '榜眼',
      '状元',
      '恭喜你，高中状元'
    ],
    index: 0,
    zong:'',
    baidu_token:'',
    id:'',
    shuaxin : true,//排行榜刷新
    shuaxin1 : true,//查询刷新
    shuzu: ["A", "B"]
  },
  onLaunch: function() {
    var that = this
    wx.login({
      //获取code
      success: function(res) { //获取code值
        that.globalData.code = res.code
        console.log(that.globalData.code);
      }
    })
  },
  getcode: function() { //全局获取 CODE值的方法
    var that = this
    wx.login({
      //获取code
      success: function(res) { //获取code值
        that.globalData.code = res.code
        console.log(that.globalData.code);
      }
    })
  },
  level: function (e) {
    var that = this
    if (e >= 280) {
      that.globalData.index = 7
    } else if (e >= 210) {
      that.globalData.index = 6
    } else if (e >= 150) {
      that.globalData.index = 5
    } else if (e >= 100) {
      that.globalData.index = 4
    } else if (e >= 60) {
      that.globalData.index = 3
    } else if (e >= 30) {
      that.globalData.index = 2
    } else {
      that.globalData.index = 1
    }
  },
})