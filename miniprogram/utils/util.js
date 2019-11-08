const { URL } = getApp();

// 返回yyyy-mm-dd HH:mm:ss
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 返回YYYY-MM-DD
const formatDay = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

// 返回HH:mm类型
const format = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
}

// 将x变成0x
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 计算yyyy-mm-dd HH:mm:ss的时间差
// 返回天数
const duration = (start, end) => {
  return (parserDate(end).getTime() - parserDate(start).getTime()) / 1000 / 60 / 60 / 24
}

// 将yyyy-mm-dd HH:mm:ss换成日期类型
const parserDate = date => {
  var t = Date.parse(date);
  if (!isNaN(t)) {
    return new Date(Date.parse(date.replace(/-/g, "/")));
  } else {
    return new Date();
  }
}

// 求某个日期前N天的日期
const preDate = (date,day) => {
  var time  = new Date(date).getTime()
  return formatDay(new Date(time-day*24*60*60*1000))
}

// 初始化查询用户信息
const getUserInfo = (that) => {
  var userInfo = wx.getStorageSync('userInfo')
  if (userInfo == ''){
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
              that.setData({
                userInfo: data.userInfo
              })
              wx.request({
                url: URL + 'user/insert',
                method: 'POST',
                data: {
                  openId: getOpenId(),
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
  }else{
    that.setData({
      userInfo: userInfo
    })
  }
}

// 获取用户的openID
const getOpenId = () => {
  var openId = wx.getStorageSync('openId')
  console.log(openId)
  if (openId == '') {
    wx.cloud.callFunction({
      name: 'getOpenId',
      success: function (res) {
        console.log(res)
        openId = res.result.OPENID
        console.log('查询用户openID成功')
        wx.setStorage({
          key: "openId",
          data: openId
        })
        return openId
      },
      fail: console.error
    })
  }
  return openId
}

// 用户授权
const saveUserInfo = (e) => {
  wx.request({
    url: URL + 'user/insert',
    method: 'POST',
    data:{
      openId: getOpenId(),
      avatarUrl: e.detail.userInfo.avatarUrl,
      nickName: e.detail.userInfo.nickName,
    },
    success(res) {
      console.log('保存用户信息成功:')
      console.log(res.data)
    }
  }) 
}

module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  formatDay: formatDay,
  duration: duration,
  format: format,
  parserDate: parserDate,
  getUserInfo: getUserInfo,
  saveUserInfo: saveUserInfo,
  preDate: preDate,
  getOpenId: getOpenId
}
