// pages/home/home.js
const app = getApp()
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},//用户基本信息
    answer: {},//答题数
    field: {},//领域
    record: {},//记录
    date: '',
    level: '',
    levUp: '',
    levDown: '',
    id:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getcode()
    var that = this
    var DATE = util.formatTime(new Date());
    this.setData({
      id: app.globalData.id,
      date: DATE,
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  tuichu(){
    wx.redirectTo({
      url: '../welcome/welcome',
    })
  },
  onShow: function () {
    var that = this
    wx.request({
      url: 'http://118.25.156.182:8080/v1/open/two/manager/findMeById/'+ app.globalData.id,
      method: 'GET',
      data: {
        // id: app.globalData.id
      },
      success(res) {
        for (var i = 0; i < res.data.userDayAnswer.length; i++) {
          if (res.data.userDayAnswer[i].answer_date == that.data.date) {
            res.data.userDayAnswer[i].answer_date = '今天'
          }
        }
        that.setData({
          userInfo: res.data.answerRanking,
          answer: res.data.totalCollcetSubject,
          field: res.data.answerRecord,
          record: res.data.userDayAnswer
        })
        app.level(res.data.answerRanking.total_score),
          that.setData({
            level: app.globalData.lev[app.globalData.index],
            levUp: app.globalData.lev[app.globalData.index + 1],
            levDown: app.globalData.lev[app.globalData.index - 1],
          })
      }
    })
  },
  noc: function (res) {
    console.log(res.target.dataset.current)
    wx.navigateTo({
      url: 'duicuozong/duicuozong?currentTab=' + res.target.dataset.current,
    })
  }
})