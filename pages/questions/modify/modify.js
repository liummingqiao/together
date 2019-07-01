// pages/questions/modify/modify.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    type_zong: ["领域", "科技", "常识", "动漫", "地理", "化学", "电脑", "自然", "物理", "旅游", "天文", "历史", "体育"],
    pd: '',
    id: 0,
    answer: '',
    area: '',
    content: '',
    options: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.request({
      url: app.globalData.http + 'four/manager/get/' + options.id,
      success(res) {
        for (var i in that.data.type_zong) {
          if (that.data.type_zong[i] === res.data.area) {
            that.setData({
              index: i
            })
          }
        }
        for (var x in res.data.options) {
          var str = JSON.stringify(res.data.options[x])
          var newstr = str.slice(1, str.length - 1)
          var arr = newstr.split(',')
          var y = '{'
          arr[0] = y + arr[0]
          if (res.data.answer == res.data.options[x].option) {
            arr.push('"rightAnwser":true}')
          } else {
            arr.push('"rightAnwser":false}')
          }
          var y = arr.join(',')
          var option = JSON.parse(y)
          that.data.options.push(option)
        }
        let dataList = that.data.options; //获取到的数据
        dataList.forEach((item) => {
          item.content = item.content.substring(2); //要截取字段的字符串
        })
        that.setData({
          content: res.data.content,
          area: res.data.area,
          id: res.data.id,
          options: dataList, //数据源
          answer: res.data.answer
        })
      }
    })
  },
  modify() {
    var that = this
    var i = 0
    if (that.data.content === '') {
      wx.showToast({
        icon: 'none',
        title: '请填写题干',
      })
    } else if (that.data.area === '') {
      wx.showToast({
        icon: 'none',
        title: '请填选择题目领域',
      })
    } else {
      that.data.pd = false
      for (i; i < that.data.options.length; i++) {
        if (that.data.options[i].content === undefined) {
          that.setData({
            pd: false
          })
          break;
        } else {
          that.setData({
            pd: true
          })
        }
      }
      if (that.data.pd === false) {
        wx.showToast({
          icon: 'none',
          title: '请填写' + that.data.options[i].option + '选项内容',
        })
      } else if (that.data.answer === '') {
        wx.showToast({
          icon: 'none',
          title: '请勾选正确答案',
        })
      } else {
        var newOptions = []
        for (var x in that.data.options) {
          var option = {
            content: '',
            id: 0,
            option: ''
          }
          option.content = that.data.options[x].option + ':' + that.data.options[x].content
          option.id = that.data.options[x].id
          option.option = that.data.options[x].option
          newOptions.push(option)
        }
        wx.request({
          url: app.globalData.http + 'four/manager/' + that.data.id,
          method: "PUT",
          data: {
            answer: that.data.answer,
            id: that.data.id,
            area: that.data.area,
            content: that.data.content,
            options: newOptions
          },
          success(res) {
            wx.redirectTo({
              url: '../Item_bank/Item_bank',
            })
          }
        })
      }
    }
  },
  select(e) {
    var that = this
    if (e.detail.value === '0') {
      that.setData({
        area: ''
      })
      console.log(that.data.area)
    } else {
      that.setData({
        index: e.detail.value,
        area: that.data.type_zong[e.detail.value]
      })
    }
  },
  option(e) {
    var that = this
    var i = e.currentTarget.dataset.index
    that.data.options[i].content = e.detail.value
  },
  addOption() {
    if (this.data.options.length <= 9) {
      var newOption = {
        option: String.fromCharCode(65 + this.data.options.length),
        contenr: undefined,
        rightAnwser: false,
      }
      this.data.options.push(newOption);
      this.setData({
        options: this.data.options
      })
    }
  },
  delOption(e) {
    if (this.data.options.length > 2) {
      this.data.options.splice(e.currentTarget.dataset.index, 1),
        this.data.options.forEach(function(item, index) {
          item.option = String.fromCharCode(65 + index)
        })
      this.setData({
        options: this.data.options
      })
    }
  },
  radio(e) {
    var that = this
    for (var i = 0; i < that.data.options.length; i++) {
      if (i == e.detail.value) {
        that.data.options[i].rightAnwser = true
        that.setData({
          answer: that.data.options[i].option
        })
      } else {
        that.data.options[i].rightAnwser = false
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
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