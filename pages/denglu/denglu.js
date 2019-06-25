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

    var that = this
    that.setData({
      code: app.globalData.code
    })
    app.getcode();
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
          url: 'http://118.25.156.182:8080/v1/open/three/manager/test1/' + that.data.code,
          method: 'POST',
          data: {},
          success(res) {
            //res  返回生成的 之前传的uuid脸 
            wx.setStorage({
              key: 'userId',    //通过key将用户信息进行保存
              data: res.data.id    //获取本地用户信息缓存进data
            })
            app.globalData.id = res.data.id
            app.globalData.baidu_token = res.data.baidu_token
            console.log(app.globalData.id);
            console.log(app.globalData.baidu_token);
          }
        }) //请求结束
      }
    }) //请求结束
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
      quality: 'high', //成像质量
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
                url: 'https://aip.baidubce.com/rest/2.0/face/v3/multi-search?access_token=' + that.data.token,
                method: 'POST',
                data: {
                  max_face_num: 10,
                  liveness_control: 'HIGH',
                  image: this.data.base64,
                  image_type: 'BASE64',
                  group_id_list: '949244171', //自己建的用户组id
                  user_id: app.globalData.baidu_token //后端传来的 
                },
                header: {
                  'Content-Type': 'application/json' // 默认值
                },
                success(res) { //人脸拍照片时返回值时是什么对应给出什么判断
                  console.log(res);
                  if (res.data.error_msg == 'pic not has face') {
                    wx.showToast({
                      title: '未检测到人脸',
                      icon: 'none',
                      duration: 3000
                    })
                  } else if (res.data.error_msg == 'face is covered') {
                    wx.showToast({
                      title: '请勿遮挡人脸',
                      icon: 'none',
                      duration: 3000
                    })
                  } else if (res.data.error_msg == 'image check fail') {
                    wx.showToast({
                      title: '图片太模糊',
                      icon: 'none',
                      duration: 3000
                    })
                  } else if (res.data.error_msg == 'liveness check fail') {
                    wx.showToast({
                      title: '请勿遮挡人脸',
                      icon: 'none',
                      duration: 3000
                    })
                  } else if (res.data.error_msg == 'match user is not found') {
                    wx.showToast({
                      title: '不匹配',
                      icon: 'none',
                      duration: 3000
                    })
                  } else if (res.data.result.face_num > 1) {
                    wx.showToast({
                      title: '请单人操作',
                      icon: 'none',
                      duration: 3000
                    })
                  } else {
                    that.setData({ //从百度获取的
                      msg: res.data.result.face_list[0].user_list[0].score,
                      msg2: res.data.result.face_list[0].user_list[0].user_info,
                      msg3_uid: res.data.result.face_list[0].user_list[0].user_id
                    })
                    if (that.data.msg < 80) {
                      wx.showToast({
                        title: '这不是你的账号，请重新扫描',
                        icon: 'none',
                        duration: 3000
                      })
                    }
                    if (that.data.msg > 80 && that.data.msg3_uid == app.globalData.baidu_token) {
                      wx.request({
                        url: 'http://118.25.156.182:8080/v1/open/three/manager/test2/' + app.globalData.code, //填数据库接受用户信息的url
                        method: 'POST', //根据后端的
                        data: {
                          avatar: app.globalData.userInfo.avatarUrl,
                          nike_name: app.globalData.userInfo.nickName,
                          city: app.globalData.userInfo.city,
                          privince: app.globalData.userInfo.province,
                          country: app.globalData.userInfo.country,
                          id: app.globalData.id,
                          baidu_token: app.globalData.baidu_token,
                        },
                        header: {
                          'Content-Type': 'application/json', // 默认值
                          code: that.data.code,
                        },
                        success(res) {
                          console.log(res)
                        }
                      })
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