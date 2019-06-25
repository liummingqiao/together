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
    userAnswersInfo: [],
    questionInfo: []
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      currentTab: options.currentTab
    })
    console.log(options)
    wx.getStorage({
      key: 'userId', //通过key将用户信息进行保存
      success(e) {
        wx.request({
          url: 'http://118.25.156.182:8080/v1/open/four/manager/' + e.data,
          method: 'POST',
          data: {
            "created_date": "string",
            "id": e.data,
            "is_right": options.currentTab,
            "pageNumber": 0,
            "pageSize": 0
          },
          success(res) {
            console.log(res.data.data)
            res.data.data.forEach(function(item){
              item.createdDate.substring(0,10);
            })
            // console.log(res.data.data.createdDate)
            that.setData({
              userAnswersInfo: res.data.data
            })
            console.log(that.data.userAnswersInfo);
            that.data.userAnswersInfo.forEach(function(item, index) {
              wx.request({
                url: 'http://118.25.156.182:8080/v1/open/four/manager/get/' + item.question_id,
                method: 'GET',
                success(res) {
                  that.data.questionInfo.push(res.data);
                  that.setData({
                    questionInfo: that.data.questionInfo
                  })
                  console.log(that.data.questionInfo);
                }
              })
            }) //end forEach
          }
        })
      }
    })
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
  // reqallquestion(e){
  // }
  /**
   * 点击tab切换
   */
  swichNav: function(e) {
    var that = this;
    console.log(e)
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      wx.getStorage({
        key: 'userId', //通过key将用户信息进行保存
        success(e) {
          wx.request({
            url: 'http://118.25.156.182:8080/v1/open/four/manager/' + e.data,
            method: 'POST',
            data: {
              "created_date": "string",
              "id": e.data,
              "is_right": that.data.currentTab,
              "pageNumber": 0,
              "pageSize": 0
            },
            success(res) {
              console.log(res);
            }
          })
        }
      })
    }
  }
})