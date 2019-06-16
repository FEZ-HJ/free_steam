var util = require('../../utils/util.js')
import Dialog from '../../dist/dialog/dialog';

Page({
  data:{
    show: true,
    activeNames: '',
    money: '0',
    rank:'0'
  },

  onLoad: function (e) {
    //设置日期样式
    if (wx.getStorageSync('signInData') != ''){
      this.setDays(util.formatDay(new Date()).substring(0, 7))
    }else{
      this.querySignDate()
    }
      
    // 设置签到按钮展示
    if (util.formatDay(new Date()) == wx.getStorageSync('isDate')){
      this.setData({
        show: false
      })
    }
    // 查询签到积分
    this.queryScore()
    // 查询签到等级
    this.queryRank()
    // 查询用户信息
    this.hasGottenUserInfo()

    // this.addScore(10)

    // this.addRank(10)
    // this.addSignDate()
  },

  
  //设置日历日期样式
  setDays:function(month){
    var days = [];
    var signInData = wx.getStorageSync('signInData')
    console.log(signInData)
    for (var i = 0; i < signInData.length&&i < 31 ; i++) {
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
    for(var i = 1 ; i < 7 ; i++){
      var date = util.preDate(util.formatDay(new Date()), i)
      if(signInData.indexOf(date)> -1){
        j++;
      }else{
        break;
      }
    }
    this.setData({
      days: days,
      continuousDay: j
    })
  },

  // 签到
  customHandler: function (e) {
    // 标记今天已经签到完成
    wx.setStorage({
      key: 'isDate',
      data: util.formatDay(new Date())
    })
    // 设置签到按钮隐藏
    this.setData({
      show: false
    })
    // 存入签到日期并修改签到记录
    this.addSignDate()
    
    Dialog.alert({
      message: '签到成功！'
    }).then(() => {
      // on close
    });

    // 增加签到积分
    if (this.data.continuousDay >= 6) {
      this.addScore(100)
    }else{
      this.addScore(50)
    }

    // 增加签到经验
    this.addRank(50)
    
  },

  // 存入签到日期
  addSignDate: function () {
    var that  = this
    wx.cloud.callFunction({
      name: 'addAndInsert',
      data: {
        date: util.formatDay(new Date()),
      },
      success: function (res) {
        that.querySignDate()
      },
      fail: console.error
    })
    console.log("签到")
  },

  // 查询签到日期
  querySignDate: function(){
    var that = this
    const db = wx.cloud.database()
    db.collection('signIn').get({
      success: res => {
        wx.setStorageSync("signInData", res.data[0].data)
        that.setDays(util.formatDay(new Date()).substring(0, 7))
      },
      fail: console.error
    })
  },

  // 添加签到积分
  addScore: function (score) {
    var that = this
    wx.cloud.callFunction({
      name: 'addAndInsertRecord',
      data: {
        score:score
      },
      success: function (res) {
        console.log(res)
        that.queryScore()
      },
      fail: console.error
    })
    console.log("签到积分")
  },

  queryScore: function(){
    var that = this
    const db = wx.cloud.database()
    db.collection('record').get({
      success: res => {
        console.log(res)
        that.setData({
          money:res.data[0].score
        })
      },
      fail: console.error
    })
  },

  //  添加等级经验 
  addRank: function (score) {
    var that = this
    wx.cloud.callFunction({
      name: 'addAndInsertRank',
      data: {
        score: score
      },
      success: function (res) {
        console.log(res)
        that.queryRank()
      },
      fail: console.error
    })
    console.log("签到经验")
  },

  // 查询等级经验
  queryRank: function () {
    var that = this
    const db = wx.cloud.database()
    db.collection('rank').get({
      success: res => {
        // 计算等级

        console.log(res)
        that.setData({
          rank: res.data[0].score
        })
      },
      fail: console.error
    })
  },

  // 下拉展示
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  // 查询用户信息
  hasGottenUserInfo:function(){
    var that = this
    wx.getSetting({
      success: (data) => {
        if (data.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (data) => {
              that.setData({
                userInfo: data.userInfo
              })
            }
          })
        }
      }
    })
  }
});