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
  wx.getSetting({
    success: (data) => {
      if (data.authSetting['scope.userInfo']) {
        wx.getUserInfo({
          success: (data) => {
            console.log("查询用户信息成功")
            that.setData({
              userInfo: data.userInfo
            })
          }
        })
      } else {
        console.log("用户暂未授权")
      }
    }
  })
}

// 用户授权
const saveUserInfo = (e) => {
    wx.cloud.callFunction({
      name: 'setUserInfo',
      data: {
        avatarUrl: e.detail.userInfo.avatarUrl,
        city: e.detail.userInfo.city,
        country: e.detail.userInfo.country,
        gender: e.detail.userInfo.gender,
        language: e.detail.userInfo.language,
        nickName: e.detail.userInfo.nickName,
        province: e.detail.userInfo.province,
      },
      success: function (res) {
        console.log("存入用户信息成功")
      },
      fail: console.error
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
  preDate: preDate
}
