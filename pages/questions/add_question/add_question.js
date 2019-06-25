// pages/questions/add_question/add_question.js
const app = getApp();
Page({
  data: {
    type_zong: ["科技", "常识", "动漫", "地理", "化学", "电脑", "自然", "物理", "旅游", "天文", "历史", "体育"],
    type: "科技",
    pd: false,
    options: [{
        option: "A",
        content: "",
        rightAnwser: "",
      },
      {
        option: "B",
        content: "",
        rightAnwser: "",
      }
    ]
  },
  addOption() {
    if (this.data.options.length <= 9) {
      var newOption = {
        option: String.fromCharCode(65 + this.data.options.length),
        contenr: "",
        rightAnwser: "",
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
      console.log(this.data.options);
      this.setData({
        options: this.data.options
      })
    }
  },
  onOptionContentInput(e) {
    this.data.options[e.target.dataset.index].content = e.detail.value
    this.setData({
      options: this.data.options
    })
  },
  change(e) {
    var that = this
    that.setData({
      type: e.currentTarget.dataset.type,
      pd: false
    })
  },
  show() {
    var that = this
    that.setData({
      pd: true
    })
  },
})