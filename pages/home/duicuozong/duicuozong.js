//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    /**
     * 页面配置
     */
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
  },
  onLoad: function(options) {
    var that = this;
    console.log(options)
    if (this.data.currentTab === options.currentTab) {
      return false;
    } else {
      that.setData({
        currentTab: options.currentTab
      })
    }
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },
  /**
   * 滑动切换tab
   */
  bindChange: function(e) {
    var that = this;
    console.log(e)
    that.setData({
      currentTab: e.detail.current
    });

  },
  /**
   * 点击tab切换
   */
  swichNav: function(e) {
    console.log(e)
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})