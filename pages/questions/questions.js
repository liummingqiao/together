const app = getApp()
Page({
  data: {
    nickName: '',
    src: '',
    level: '',
    score: ''
  },
  //事件处理函数
  onLoad: function() {
    var that = this;
    that.setData({ //获取当前用户的头像和名称
      src: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName
    })
  },
  onShow: function() {
    var that = this
    wx.request({
      url: 'http://118.25.156.182:8080/v1/open/two/manager/findMeById/' + app.globalData.id,
      method: "GET",
      dataType: 'json',
      header: { //头部返回信息
        'content-type': 'application/json',
      },
      success: function(res) { //成功的时候的回调
        that.setData({
          score: res.data.answerRanking.total_score
        })
        app.globalData.zong = res.data.answerRanking.total_score
        app.level(res.data.answerRanking.total_score),
          that.setData({
            level: app.globalData.lev[app.globalData.index]
          })
        console.log(that.data.level);
      }
    })
  },
  denglu() {
    wx.navigateTo({
      url: 'ti/ti',
    })
  },
  lv() {
    wx.navigateTo({
      url: 'lv/lv',
    })
  }
})