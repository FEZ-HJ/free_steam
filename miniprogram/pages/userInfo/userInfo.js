var util = require('../../utils/util.js')
import Dialog from '../../dist/dialog/dialog';
import Notify from '../../dist/notify/notify';
import Toast from '../../dist/toast/toast';

const { grades, levels, addMaxScore , addMinScore } = getApp();
let rewardedVideoAd = null

Page({
  data:{
    // 下拉菜单打开项ID
    activeNames: '',
    // 积分
    money: '0',
    // 等级
    rank:'1',
    // 经验比
    progress: '0',
    // 用户信息
    userInfo: null,
    // 连续签到天数
    continuousDay:0,
    // 奖品信息
    lottery_info:null,
    // 签到记录
    days:null,
    show: true
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
    this.onLoadUserInfo()
    // 查询抽奖信息 
    this.getLotteryContent()

    // 创建广告
    if (wx.createRewardedVideoAd) {
      rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-4bf71ea0625f3676' })
      rewardedVideoAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      rewardedVideoAd.onError((err) => {
        console.log('onError event emit', err)
      })
      rewardedVideoAd.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          this.addLotteryRecord()
        } else {
          Toast('观看完整广告才可参与抽奖！');
        }
      })
    }

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
  customHandler: function () {
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
    var t = parseInt(this.data.continuousDay) + 1
    Toast('已连续签到' + t +'天！');

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
    this.customHandler()
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

// 初始化查询用户信息
  onLoadUserInfo: function () {
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
        } else {
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
  },

  // 抽奖
  lottery:function(){
    this.addLotteryRecord()
    // rewardedVideoAd.show().catch(() => {
    //   // 失败重试
    //   rewardedVideoAd.load()
    //     .then(() => rewardedVideoAd.show())
    //     .catch(err => {
    //       console.log('激励视频 广告显示失败')
    //     })
    // })
  },

  // 用户授权
  onGotUserInfo: function (e) {
    if (e.detail.userInfo != undefined) {
      this.setData({
        userInfo: e.detail.userInfo
      })
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
          console.log(res)
          console.log("存入用户信息成功")
        },
        fail: console.error
      })
      this.lottery()
    } else {
      Toast('授权之后才能参与抽奖哦！');
    }
  },

  // 查询抽奖信息 
  getLotteryContent: function () {
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    db.collection('lottery-content').where({
      avatarURL: _.eq(null)
    }).orderBy('_id', 'desc').get({
      success: res => {
        that.setData({
          lottery_info: res.data
        })
        console.log("查询抽奖信息成功")
      },
      fail: console.error
    })
  },

  // 存入抽奖次数
  addLotteryRecord: function(){
    console.log("开始存入抽奖次数")
    var that = this
    wx.cloud.callFunction({
      name: 'addAndInsertLotteryRecord',
      data: {
        nickName: that.data.userInfo.nickName,
        avatarUrl: that.data.userInfo.avatarUrl,
        uid: "1"
      },
      success: function (res) {
        console.log("存入抽奖次数成功")
      },
      fail: console.error
    })
  }

});
