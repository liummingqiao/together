// pages/rankinglist/youself/youself.js
const app = getApp()
var util  = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    zong: {},
    dengji: [],
    date:'',
    pd:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id  =  options.id
    var lev = [];
    var DATE = util.formatTime(new Date());
    this.setData({
      date: DATE,
    });
    var that = this
    wx.request({
      url: 'http://192.168.137.109:8080/v1/open/two/manager/findMeById/' + id,
      method: "GET",
      dataType: 'json',
      header: { //头部返回信息
        'content-type': 'application/json',
      },
      success: function(res) { //成功的时候的回调
        console.log(res)
        if (res.data.userDayAnswer.length > 0){
        for (var i = 0; i < res.data.userDayAnswer.length; i++) {
          app.level(res.data.userDayAnswer[i].day_total_score)
          lev.push(app.globalData.lev[app.globalData.index])
        }
        for (var q = 0 ; q < res.data.userDayAnswer.length; q++) {
          if (res.data.userDayAnswer[q].answer_date == that.data.date) {
            res.data.userDayAnswer[q].answer_date = '今天'
          }
        }
        }else{
          that.setData({
            pd : true
          })
        }
        that.setData({
          dengji: lev,
          zong: res.data
        })
      }
    })
  },
})