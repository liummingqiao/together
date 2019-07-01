// pages/questions/Item_bank/Item_bank.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    search: '',
    page: true,
    stem: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var query = wx.createSelectorQuery();
    query.select('#search').boundingClientRect()
    query.exec(function(res) {
      var x = res[0].height
      console.log(res);
      wx.getSystemInfo({
        success: function(res) {
          console.log(res);
          that.setData({
            scrollHeight: res.windowHeight - x,
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    var stems = that.data.stem
    wx.request({
      url: app.globalData.http + 'one/manager/page',
      method: 'POST',
      data: {
        keyWords: that.data.search,
        pageNumber: that.data.num,
        pageSize: 10
      },
      header: { //头部返回信息
        'content-type': 'application/json',
        'accept': 'application/json',
        Authorization: 1
      },
      success(res) {
        console.log(res);
        wx.hideToast()
        if (that.data.page === true) {
          if (res.data.data == '') {
            that.setData({
              num: that.data.num - 1
            })
            wx.showToast({
              title: '暂无更多题目',
              icon: 'none',
              duration: 2000
            })
          }
          var stem = res.data.data
          for (var i = 0; i < stem.length; i++) {
            wx.request({
              url: app.globalData.http + 'four/manager/get/' + stem[i].id,
              success(res) {
                stems.push(res.data)
                that.setData({
                  page: false,
                  stem: stems,
                })
              }
            })
          }
        }
      }
    })
  },
  deletes(e) {
    var that = this
    wx.request({
      url: app.globalData.http + 'four/manager/' + e.currentTarget.dataset.id,
      method: "DELETE",
      success(res) {
        that.setData({
          num: 1,
          page: true,
          stem: []
        })
        that.onShow()
      }
    })
  },
  modify(e) {
    wx.navigateTo({
      url: '../modify/modify?id=' + e.currentTarget.dataset.id,
    })
  },
  search(e) {
    var that = this
    that.setData({
      search: e.detail.value,
      num: 1,
      page: true,
      stem: []
    })
    that.onShow()
  },
  paging() {
    var that = this
    that.setData({
      num: that.data.num + 1,
      page: true
    })
    wx.showToast({
      title: '加载第' + that.data.num + '页',
      icon: 'loading',
      duration: 20000
    })
    that.onShow()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})