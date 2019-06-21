// pages/rankinglist/rankinglist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phb: [],
    dengji: [],
    num: 1,
    user_id: '',
    heigth: '',
    page: 1
  },
  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          heigth: res.windowHeight - 76
        })
        console.log(res)
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(e) {
    var that = this;
    var i = 0;
    var lev = [];
    var l = that.data.phb;
    wx.request({
      url: 'http://118.25.156.182:8080/v1/open/two/manager/page',
      data: {
        // pageSize: that.data.num,
        pageNumber: that.data.page,
        Authorization: "1"
      },
      method: "POST",
      dataType: 'json',
      header: { //头部返回信息
        'content-type': 'application/json',
        Authorization: 1
      },
      success: function(res) { //成功的时候的回调
        console.log(res)
        if (res.data.data.length !== 0) {
          for ( var q = 0; q < res.data.data.length; q++) {
          l.push(res.data.data[q]);
          }
          that.setData({
            phb: l
            //看下变变的控制台里找到这个 值进行一个小判断
          })
          console.log(that.data.phb);
          for (i = 0; i < res.data.data.length; i++) {
            app.level(res.data.data[i].total_score) //传值
            lev.push(app.globalData.lev[app.globalData.index])
          }
          that.setData({
            dengji: lev
          })
        }
      }
    })
  },
  onShareAppMessage: function(res) {
    if (res.from == 'button') {
      return {
        title: '转发',
        path: '/pages//rankinglist/rankinglist',
        success: function(res) {
          console.log("chenggong", res)
        }
      }
    }
  },
  loning() {//下拉加载事件
    var that = this
    var y = that.data.page
    that.setData({
      page: y + 1
    })
    that.onShow()
  },
  idInput: function(e) {
    var that = this
    that.setData({
      user_id: e.detail.value
    })
  },
  to_youself: function() {
    var that = this
    wx.navigateTo({
      url: 'youself/youself?id=' + that.data.user_id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //下拉
  onReachBottom: function() {},
  tiaozhuan: function(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: 'youself/youself?id=' + e.currentTarget.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})