var util = require('../../utils/util.js')
var signInUtil = require('../../utils/signIn.js')
import Dialog from '../../dist/dialog/dialog';
import Notify from '../../dist/notify/notify';
import Toast from '../../dist/toast/toast';

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
    signIn: true
  },

  onShow: function(){
    // 设置签到按钮展示
    if (util.formatDay(new Date()) == wx.getStorageSync('isDate')) {
      this.setData({
        signIn: false
      })
    }
    // 查询签到积分
    signInUtil.queryScore(this)
    // 查询签到等级
    signInUtil.queryRank(this)
  },

  onLoad: function (e) {

    //设置日期样式
    if (wx.getStorageSync('signInData') != ''){
      signInUtil.setDays(this,util.formatDay(new Date()).substring(0, 7))
    }else{
      signInUtil.querySignDate(this)
    }
    // 查询用户信息
    util.getUserInfo(this)
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

  // 签到
  customHandler: function () {
    signInUtil.signInHome(this)
    Notify('连续签到7天以上，经验积分奖励翻倍！');
    var t = parseInt(this.data.continuousDay) + 1
    Toast('已连续签到' + t + '天！');
  },

  // 下拉展示
  onChange: function(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  // 查询用户信息
  hasGottenUserInfo:function(){
    signInUtil.signInHome(this)
    util.getUserInfo(this)
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
      util.saveUserInfo(e)
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
      avatarUrl: _.eq(null)
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
        uid: that.data.lottery_info[0]._id
      },
      success: function (res) {
        console.log("存入抽奖次数成功")
      },
      fail: console.error
    })
  }

});
