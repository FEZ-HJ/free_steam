var util = require('/util.js')
const { grades, levels, addMaxScore, addMinScore } = getApp();

// 签到
const signInHome = (that) => {

  // 标记今天已经签到完成
  wx.setStorage({
    key: 'isDate',
    data: util.formatDay(new Date())
  })
  // 设置签到按钮隐藏
  that.setData({
    signIn: false
  })
  // 存入签到日期并修改签到记录
  addSignDate(that)

  // 增加签到积分 增加签到经验
  if (that.data.continuousDay >= 6) {
    addScore(that,addMaxScore)
    addRank(that,addMaxScore)
  } else {
    addScore(that,addMinScore)
    addRank(that,addMinScore)
  }
}

// 存入签到日期
const addSignDate = (that) => {
  console.log("开始存入签到日期")
  wx.cloud.callFunction({
    name: 'addAndInsert',
    data: {
      date: util.formatDay(new Date()),
    },
    success: function (res) {
      console.log("存入签到日期成功")
      querySignDate(that)
    },
    fail: console.error
  })
}

// 添加签到积分
const addScore = (that,score) => {
  console.log("开始存入签到积分")
  wx.cloud.callFunction({
    name: 'addAndInsertRecord',
    data: {
      score: score
    },
    success: function (res) {
      console.log("存入签到积分成功")
      queryScore(that)
    },
    fail: console.error
  })
}

//  添加等级经验
const addRank = (that,score) => {
  console.log("开始存入签到经验")
  wx.cloud.callFunction({
    name: 'addAndInsertRank',
    data: {
      score: score
    },
    success: function (res) {
      console.log("存入签到经验成功")
      queryRank(that)
    },
    fail: console.error
  })
}

// 查询签到日期
const querySignDate = (that) => {
  console.log("开始查询签到日期")
  const db = wx.cloud.database()
  db.collection('signIn').get({
    success: res => {
      console.log("查询签到日期成功" + res.data[0].data)
      wx.setStorageSync("signInData", res.data[0].data)
      setDays(that,util.formatDay(new Date()).substring(0, 7))
    },
    fail: console.error
  })
}

// 查询签到积分
const queryScore = (that) => {
  console.log("开始查询签到积分")
  const db = wx.cloud.database()
  db.collection('record').get({
    success: res => {
      console.log("查询签到积分成功" + res.data[0].score)
      that.setData({
        money: res.data[0].score
      })
    },
    fail: console.error
  })
}

// 查询等级经验
const queryRank = (that) => {
  console.log("开始查询签到经验")
  const db = wx.cloud.database()
  db.collection('rank').get({
    success: res => {
      console.log("查询签到经验成功:" + res.data[0].score)
      // 计算等级
      var grade = res.data[0].score
      for (var i = 0; i < levels.length; i++) {
        if (levels[i] > grade) {
          that.setData({
            rank: i,
            progress: ((grade - levels[i - 1]) / grades[i] * 100).toFixed(1)
          })
          break
        }
      }
    },
    fail: console.error
  })
}

//设置日历日期样式
const setDays = (that,month) => {
  var days = [];
  var signInData = wx.getStorageSync('signInData')
  console.log("从缓存获取签到日期成功" + signInData)
  for (var i = 0; i < signInData.length && i < 31; i++) {
    if (signInData[i].indexOf(month) >= 0) {
      days.push({
        month: 'current',
        day: signInData[i].substring(8, 10),
        color: 'white',
        background: '#0080FF'
      })
    }
  }
  // 获取连续签到天数
  var j = 0;
  for (var i = 1; i < 7; i++) {
    var date = util.preDate(util.formatDay(new Date()), i)
    if (signInData.indexOf(date) > -1) {
      j++;
    } else {
      break;
    }
  }
  that.setData({
    days: days,
    continuousDay: j
  })
}

module.exports = {
  signInHome: signInHome,
  querySignDate: querySignDate,
  queryScore: queryScore,
  queryRank: queryRank,
  setDays: setDays
}