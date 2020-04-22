const grades = [0, 120, 360, 360, 480, 600, 960, 1320, 1680, 2040, 2400, 2760, 3120, 3480, 3840, 4200, 8280, 9600, 12000, 14400, 15000, 20000, 25000, 30000, 35000, 45000, 55000, 65000, 75000, 85000];

const levels = [0, 120, 480, 840, 1320, 1920, 2880, 4200, 5880, 7920, 10320, 13080, 16200, 19680, 23520, 27720, 36000, 45600, 57600, 72000, 87000, 107000, 132000, 162000, 197000, 242000, 297000, 362000, 437000, 522000]

const addMaxScore = 100;
const addMinScore = 50;

// const URL = "http://localhost/steamfree/";
const URL = "https://steamfree.online/steamfree/";

App({
  grades: grades,
  levels: levels,
  addMaxScore: addMaxScore,
  addMinScore: addMinScore,
  URL: URL,
  onLaunch: function () {
    // 初始化时获取用户openID
    var openId = wx.getStorageSync('openId')
    if(openId == ''){
      wx.login({
        success (res) {
          if (res.code) {
            wx.request({
              url: URL + 'wxLogin',
              data: {code: res.code},
              success(res1){
                wx.setStorage({
                  key: "openId",
                  data: res1.data.openid
                })
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }

    wx.getSetting({
      success: (data) => {
        if (data.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (data) => {
              console.log("查询用户信息成功")
              wx.setStorage({
                key: "userInfo",
                data: data.userInfo
              })
              wx.request({
                url: URL + 'user/insert',
                method: 'POST',
                data:{
                  openId: wx.getStorageSync('openId'),
                  avatarUrl: data.userInfo.avatarUrl,
                  nickName: data.userInfo.nickName,
                },
                success(res) {
                  console.log('保存用户信息成功:')
                  console.log(res.data)
                }
              }) 
            }
          })
        } else {
          console.log("用户暂未授权")
        }
      }
    })

    this.globalData = {}
  }
})
