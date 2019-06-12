const app = getApp();
Page({
  data: {
    base64: "",
    token: "",
    msg: "",
    src: "",
    msg1: '',
    msg2: '',
    code: '',
    uid: '',
    msg3_uid: ''
  },
  onLoad() {
    app.getcode();
    var that = this
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token', //是真实的接口地址
      data: {
        grant_type: 'client_credentials',
        client_id: 'oiz5d7izM3Z8dy3d6rM467wp', //用你创建的应用的API Key
        client_secret: '7IRakUtwQ4YCkXUawTlLtTUDicO5xEFY' //用你创建的应用的Secret Key
      },
      header: {
        'Content-Type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          token: res.data.access_token //获取到token
        })
        console.log(that.data.token);
        wx.request({
          url: 'http://192.168.137.109:8080/v1/open/three/manager/test1/' + app.globalData.code,
          method: 'POST',
          data:{
          },
          success(res){
            //res  返回生成的 之前传的uuid脸 
            app.globalData.id = res.data.id
            app.globalData.baidu_token = res.data.baidu_token
            console.log(app.globalData.id);
            console.log(app.globalData.baidu_token);
          }
          
        })//请求结束
      }
    })//请求结束
  },
  //拍照并编码
  takePhoto() {
    //拍照
    var that = this;
    that.setData({
      code: app.globalData.code
    })
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',//成像质量
      success: (res) => {
        that.setData({
          src: res.tempImagePath //获取图片
        })
        //图片base64编码
        wx.getFileSystemManager().readFile({
          filePath: that.data.src, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            that.setData({
                base64: res.data
              }),
              wx.request({
                url: 'https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=' + that.data.token,
                method: 'POST',
                data: {
                  image: this.data.base64,
                  image_type: 'BASE64',
                  group_id_list: '949244171', //自己建的用户组id
                  user_id: app.globalData.baidu_token //后端传来的 
                },
                header: {
                  'Content-Type': 'application/json' // 默认值
                },
                success(res) {
                  console.log(res);
                  that.setData({ //从百度获取的
                    msg: res.data.result.user_list[0].score,
                    msg2: res.data.result.user_list[0].user_info,
                    msg3_uid: res.data.result.user_list[0].user_id
                  })
                  if (that.data.msg > 80 && that.data.msg3_uid == app.globalData.baidu_token ) {
                    wx.showToast({
                      title: '验证通过',
                      icon: 'success',
                      duration: 5000
                    })
                    // 验证通过，跳转至UI页面
                    wx.switchTab({
                      url: '../questions/questions'
                    })
                  }
                }
              });
          },
        })
        //上传人脸进行 比对
        wx.showToast({
          title: '请重试',
          icon: 'loading',
          duration: 500
        })
      },
      error(e) {
        console.log(e.detail)
      }
    })
  }
})