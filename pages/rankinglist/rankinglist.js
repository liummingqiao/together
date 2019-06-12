// pages/rankinglist/rankinglist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phb: [],
    dengji: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(e) {
    var that = this;
    var i = 0;
    var lev = [];
    wx.request({
      url: 'http://192.168.137.109:8080/v1/open/two/manager/page',
      data: {
        "pageSize": 50,
        Authorization: "1"
      },
      method: "POST",
      dataType: 'json',
      header: { //头部返回信息
        'content-type': 'application/json',
        Authorization: 1
      },
      success: function(res) { //成功的时候的回调
        that.setData({
          phb: res.data.data
          //看下变变的控制台里找到这个 值进行一个小判断
        })
        for (i = 0; i < res.data.data.length; i++) {
          app.level(res.data.data[i].total_score) //传值
          lev.push(app.globalData.lev[app.globalData.index])
        }
        that.setData({
          dengji: lev
        })
      }
    })
  },
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