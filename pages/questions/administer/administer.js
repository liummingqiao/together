// pages/questions/add_question/add_question.js
const app = getApp();
Page({
  data: {},
  onShow() {
    var that = this
    that.setData({
      index: 0,
      type_zong: ["领域", "科技", "常识", "动漫", "地理", "化学", "电脑", "自然", "物理", "旅游", "天文", "历史", "体育"],
      pd: '',
      answer: '',
      area: '',
      content: '',
      options: [{
          option: "A",
          content: undefined,
          rightAnwser: false,
        },
        {
          option: "B",
          content: undefined,
          rightAnwser: false,
        }
      ]
    })
  },
  content(e) {
    var that = this
    that.setData({
      content: e.detail.value
    })
  },
  add() {
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
            option: ''
          }
          option.content = that.data.options[x].option + ':' + that.data.options[x].content
          option.option = that.data.options[x].option
          newOptions.push(option)
        }
        wx.request({
          url: app.globalData.http + 'four/manager/add',
          method: "POST",
          data: {
            answer: that.data.answer,
            id: '',
            area: that.data.area,
            content: that.data.content,
            options: newOptions
          },
          success(res) {
            wx.navigateTo({
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
    console.log(e.detail.value);
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
  itemBank() {
    wx.navigateTo({
      url: '../Item_bank/Item_bank',
    })
  }
})