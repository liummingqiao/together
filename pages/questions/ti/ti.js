// pages/questions/ti/ti.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: [],//试题答案总和
    ani: null,
    anm: null, //正确的选项
    timu: '',//获取试题内容
    type: '',//题的内容
    id_t: '',//试题的ID
    back: '',
    grade: app.globalData.zong,//当前总分
    
  },
  //动画效果
  start: function(e) {
    if (e == 0) {
      this.setData({
        anm: true
      })
    } else if (e == 1) {
      this.setData({
        anm: false
      })
    }
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 100
    });
    animation.opacity(0).translate(0, -30).step()
    this.setData({
      ani: animation.export(),
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.setData({
      grade: app.globalData.zong, //用户当前总分
    })
    wx.request({
      url: 'http://118.25.156.182:8080/v1/open/one/manager/random', //后端接收信息
      method: "GET",
      dataType: 'json',
      header: { //头部返回信息
        'content-type': 'application/json'
      },
      success: function(res) { //成功的时候的回调
        that.setData({
          id_t: res.data.id, //获取题目ID
          timu: res.data.content, //获取试题内容
          type: res.data.knowledgeArea,
          options: res.data.questionOptions,
        })
        let dataList = that.data.options; //获取到的数据
        dataList.forEach((item) => {
          item.optionContent = item.optionContent.substring(2); //要截取字段的字符串
        })
        that.setData({
          options: dataList //数据源
        })
        console.log(that.data.options);
      }
    }) //请求结束
  },
  denglu() {
    wx.redirectTo({
      url: 'ti',
    })
  },
  dati: function(e) {
    var that = this;
    if (that.data.anm == null) {//只能判断一次
      wx.request({
        url: 'http://118.25.156.182:8080/v1/open/one/manager/submitAnswers/{user_id}', //发送答案给后端
        method: "POST",
        dataType: 'json',
        header: { //头部返回信息
          'content-type': 'application/json'
        },
        data: {
          id: app.globalData.id, //用户自己生成的
          answer: e.currentTarget.dataset.text,//用户选择的答案
          topicid: that.data.id_t//题目的id
        },
        success: function(res) { //成功的时候的回调
          app.globalData.zong = res.data.total_score
          that.setData({
            back: res.data.comment_answer,//正确答案
            anm: res.data.is_right,//是否正确 0 、 1
            grade: app.globalData.zong , //用户当前总分
          })
          
          
          that.start(that.data.anm);
          // 对错动画切换
          var Index = e.currentTarget.dataset.index;//接收用户选项
          var missionArr = that.data.options;
          for (let i in missionArr) {
            //遍历列表数据      
            if (i == Index) {
              //根据下标找到目标,改变状态  
              if (missionArr[i].option == res.data.comment_answer) {//如果请求的答案和
                missionArr[i].id = true;
              } else {
                missionArr[i].id = false;
              }
              console.log(missionArr[i])
            }
         }
          //数组重新赋值
          that.setData({
            options: missionArr
          })
        } //success的闭合
      })
    }//判断一次 
  }
})