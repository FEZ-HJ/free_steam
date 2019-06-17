var util = require('../../utils/util.js')
import Dialog from '../../dist/dialog/dialog';
import Notify from '../../dist/notify/notify';
import Toast from '../../dist/toast/toast';

const { grades, levels, addMaxScore , addMinScore } = getApp();

Page({
  data:{
    show: true,
    activeNames: '',
    money: '0',
    rank:'1',
    progress: '0',
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
    console.log("从缓存获取签到日期成功" + signInData)
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

    Notify('连续签到7天以上，经验积分奖励翻倍！');
    Toast('签到成功！');

    // 增加签到积分 增加签到经验
    if (this.data.continuousDay >= 6) {
      this.addScore(addMaxScore)
      this.addRank(addMaxScore)
    }else{
      this.addScore(addMinScore)
      this.addRank(addMinScore)
    }

  },

  // 存入签到日期
  addSignDate: function () {
    console.log("开始存入签到日期")
    var that  = this
    wx.cloud.callFunction({
      name: 'addAndInsert',
      data: {
        date: util.formatDay(new Date()),
      },
      success: function (res) {
        console.log("存入签到日期成功")
        that.querySignDate()
      },
      fail: console.error
    })
  },

  // 查询签到日期
  querySignDate: function(){
    console.log("开始查询签到日期")
    var that = this
    const db = wx.cloud.database()
    db.collection('signIn').get({
      success: res => {
        console.log("查询签到日期成功" + res.data[0].data)
        wx.setStorageSync("signInData", res.data[0].data)
        that.setDays(util.formatDay(new Date()).substring(0, 7))
      },
      fail: console.error
    })
  },

  // 添加签到积分
  addScore: function (score) {
    console.log("开始存入签到积分")
    var that = this
    wx.cloud.callFunction({
      name: 'addAndInsertRecord',
      data: {
        score:score
      },
      success: function (res) {
        console.log("存入签到积分成功")
        that.queryScore()
      },
      fail: console.error
    })
  },

  // 查询签到积分
  queryScore: function(){
    console.log("开始查询签到积分")
    var that = this
    const db = wx.cloud.database()
    db.collection('record').get({
      success: res => {
        console.log("查询签到积分成功" + res.data[0].score)
        that.setData({
          money:res.data[0].score
        })
      },
      fail: console.error
    })
  },

  //  添加等级经验
  addRank: function (score) {
    console.log("开始存入签到经验")
    var that = this
    wx.cloud.callFunction({
      name: 'addAndInsertRank',
      data: {
        score: score
      },
      success: function (res) {
        console.log("存入签到经验成功")
        that.queryRank()
      },
      fail: console.error
    })
  },

  // 查询等级经验
  queryRank: function () {
    console.log("开始查询签到经验")
    var that = this
    const db = wx.cloud.database()
    db.collection('rank').get({
      success: res => {
        console.log("查询签到经验成功:" + res.data[0].score)
        // 计算等级
        var grade = res.data[0].score
        for (var i = 0; i < levels.length ; i++){
          if (levels[i] > grade){
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
  },

  // 下拉展示
  onChange: function(event) {
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
              console.log("查询用户信息成功")
              that.setData({
                userInfo: data.userInfo
              })
            }
          })
        }else{
          console.log("用户暂未授权")
        }
      }
    })
  },

  // 积分兑换 
  convert:function(e){
    var spend = e.currentTarget.dataset.replyType
    if (spend > this.data.money){
      Dialog.alert({ message: '该礼品需要' + spend +'积分,您的积分不足'}).then(() => {});
    }
  }

});
