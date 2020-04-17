var util = require('/util.js')
const { URL } = getApp();
// 查询签到信息
// 签到日期
// 签到积分
// 今日是否签到
const getSignInfo = (that) => {
  wx.request({
    url: URL + 'signIn/getRecord?openId=' + wx.getStorageSync('openId'),
    success(res) {
      console.log('查询签到信息:')
      console.log(res.data)
      setInfo(res,that)
    }
  }) 
}

// 签到
const singn = (that) =>{
  wx.request({
    url: URL + 'signIn/in?openId=' + wx.getStorageSync('openId'),
    success(res) {
      console.log('存入签到信息成功：')
      console.log(res.data)
      setInfo(res, that)
    }
  }) 
}

// 存入签到信息
// 签到日期
// 签到积分
// 今日是否签到
const setInfo = (res,that) =>{
  var month = util.formatDay(new Date()).substring(0, 7)
  var days = [];
  for (var i = 0; i < res.data.signInRecords.length && i < 31; i++) {
    if (res.data.signInRecords[i].indexOf(month) >= 0) {
      days.push({
        month: 'current',
        day: res.data.signInRecords[i].substring(8, 10),
        color: 'white',
        background: '#0080FF'
      })
    }
  }
  var signIn = true
  if (res.data.signInRecords.indexOf(util.formatDay(new Date())) >= 0) {
    signIn = false
  }

  that.setData({
    days: days,
    signIn: signIn,
    money: res.data.exp == undefined ? 0 : res.data.exp.canUse
  })
}

module.exports = {
  getSignInfo: getSignInfo,
  singn: singn
}