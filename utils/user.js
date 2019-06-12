 
 wx.login({
      //获取code
      success: function(res) {
        that.setData({
          code: res.code //返回code
        })
        console.log(that.data.code);
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx72cbc76cfbbc56b4&secret=c5d364d8534a8e6a8e751f797bcee951&js_code=' + that.data.code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            that.setData({
              openid: res.data.openid //返回openid
            })
            console.log("-----------------------")
            // wx.request({
            //   url: 'https://easy-mock.com/mock/5cef43eef6820b0b9bdc314b/example/ceshi', //填数据库接受用户信息的url
            //   method: 'POST',
            //   data:{
            //     openid: that.data.openid
            //   },
            //      header: {
            //     'Content-Type': 'application/x-www-form-urlencoded' // 默认值
            //   },
            // })                               + that.data.openid
           
          },
        })
      }
    })