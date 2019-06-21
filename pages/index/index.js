// camera.js
const app = getApp()
Page({
  data: {
    src: "", //图片的链接
    token: "",
    base64: "",
    msg: "",
    uid: null,
    userid: '',
    gj: '',
    city: '',
    gender: 0,
    filePath: '',
    code: '',
    privince: '',
    src_t:''
  },
  onLoad() {
    var that = this
    app.getcode(); //异步获取code
    that.setData({ //文件下载路径
      privince: app.globalData.userInfo.province,
      src_t: app.globalData.userInfo.avatarUrl,
      city: app.globalData.userInfo.city,
      gender: app.globalData.userInfo.gender,
      userid: app.globalData.userInfo.nickName,
      gj: app.globalData.userInfo.country
    })
    wx.request({ //请求百度的token值
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
        console.log(that.data.token + "我是百度接口的TOK值");
      }
    })

  },
  //拍照
  takePhoto() {
    var that = this;
    var shiyan = '';

    that.setData({
      code: app.globalData.code
    })
    app.getcode();
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 16; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1); //随机生成同一个UUID
    }
    var uuid = s.join("");
    that.setData({
      uid: uuid
    })
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
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
              base64: res.data //返回的格式
            })
            //向百度的接口传值
            wx.request({
              url: 'https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add?access_token=' + that.data.token,
              method: 'POST',
              data: {
                image_type: 'BASE64',
                image: that.data.base64,
                group_id: '949244171', //自己建的用户组id
                user_id: that.data.uid, //这里用户身份证 that.data.openid  that.data.uid￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥
                user_info: that.data.userid //这里获取用户昵称
              },
              header: {
                'Content-Type': 'application/json' // 默认值
              },
              success(res) {
                that.setData({
                  msg: res.data.error_msg
                })
                //做成功判断
                if (that.data.msg == 'SUCCESS') { //微信js字符串请使用单引号
                  wx.showToast({
                    title: '注册成功',
                    icon: 'success',
                    duration: 5000
                  })
                  // app.getUserInfo(function(personInfo) { //调用app中的方法把变量补齐
                  //更新数据
                  wx.request({
                    url: 'http://118.25.156.182:8080/v1/open/three/manager/' + that.data.code, //填数据库接受用户信息的url
                    method: 'POST', //根据后端的
                    data: {
                      avatar: that.data.src_t,
                      nike_name: that.data.userid,
                      city: that.data.city,
                      baidu_token: that.data.uid,
                      privince: that.data.privince,
                      country: that.data.gj
                    },
                    header: {
                      'Content-Type': 'application/json', // 默认值
                    },
                    success(res) {
                      wx.navigateTo({
                        url: '../first/first',
                      })
                    }
                  })
                }
              }
            })
          }
        })
      } //拍照成功结束

    }) //调用相机结束
    //acess_token获取,qs:需要多次尝试
    //失败尝试
    wx.showToast({
      title: '请重试',
      icon: 'loading',
      duration: 500
    })
  },
  error(e) {
    console.log(e.detail)
    console.log("ffffffffffffff")
  },
  //先授权登陆，再拍照注册
  btnreg: function() {
    wx.showModal({
      title: '注册须知',
      content: '先授权登陆，再拍照注册哦!',
    })
  },
})