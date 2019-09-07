// miniprogram/pages/lottery-details/index.js
var util = require('../../utils/util.js')
import Toast from '../../dist/toast/toast';
import Dialog from '../../dist/dialog/dialog';
let rewardedVideoAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 奖品ID
    lotteryId: '',
    // 用户信息
    userInfo:null,
    // 奖品信息
    lottery_info:null,
    // 当前用户抽奖记录
    lottery_recordSelf:null,
    // 抽奖记录
    lottery_record:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if(options.id == null){
      Toast('暂无抽奖活动，请耐心等候')
      return;
    }

    // 查询当前用户抽奖信息
    this.getLotteryRecordSelf(options.id)
    // 查询用户授权信息
    util.getUserInfo(this)
    // 查询奖品信息
    this.getLotteryContent(options.id)
    // 查询抽奖记录
    this.getLotteryRecord(options.id)
    // 奖品ID
    this.setData({
      lotteryId: options.id
    })
    // 创建广告
    if (wx.createRewardedVideoAd) {
      rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-2d7779a83a4c99d6' })
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

  // 查询抽奖详情
  getLotteryContent:function(id){
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    db.collection('lottery-content').where({
      _id: _.eq(id)
    }).get({
      success: res => {
        that.setData({
          lottery_info: res.data[0]
        })
        console.log("查询抽奖信息成功")
      },
      fail: console.error
    })
  },

  // 查询全部抽奖记录
  getLotteryRecord:function(id){
    var that = this
    wx.cloud.callFunction({
      name: 'queryLotteryRecord',
      data: {
        uid: id,
      },
      success: function (res) {
        that.setData({
          lottery_record: res.result.data
        })
        console.log("查询抽奖记录成功")
      },
      fail: console.error
    })
  },
  
  // 查询当前用户抽奖记录
  getLotteryRecordSelf: function (id) {
    var that = this
    wx.cloud.callFunction({
      name: 'queryLotteryRecordSelf',
      data: {
        uid: id,
      },
      success: function (res) {
        console.log("查询当前用户抽奖信息成功")
        if (res.result.data.length > 0) {
          that.setData({
            lottery_recordSelf: res.result.data[0]
          })
        }
      },
      fail: console.error
    })
  },

  // 用户授权
  onGotUserInfo: function (e) {
    if (e.detail.userInfo != undefined) {
      this.setData({
        userInfo: e.detail.userInfo
      })
      util.saveUserInfo(e)
      this.lottery()
    }else{
      Toast('授权之后才能参与抽奖哦！');
    }
  },

  // 抽奖
  lottery: function () {
    // this.addLotteryRecord()
    rewardedVideoAd.show().catch(() => {
      // 失败重试
      rewardedVideoAd.load()
        .then(() => rewardedVideoAd.show())
        .catch(err => {
          console.log('激励视频 广告显示失败')
        })
    })
  },

  // 存入抽奖次数
  addLotteryRecord: function () {
    console.log("开始存入抽奖次数")
    var that = this
    wx.cloud.callFunction({
      name: 'addAndInsertLotteryRecord',
      data: {
        nickName: that.data.userInfo.nickName,
        avatarUrl: that.data.userInfo.avatarUrl,
        uid: that.data.lotteryId
      },
      success: function (res) {
        console.log("存入抽奖次数成功")
        that.getLotteryRecordSelf(that.data.lotteryId,that.data._openid)
        that.getLotteryRecord(that.data.lotteryId)
      },
      fail: console.error
    })
  },

  // 抽奖历史页面
  history: function () {
    wx.navigateTo({
      url: '../lottery-history/index'
    })
  },

  // 领取奖品 
  honoree:function(){
    const db = wx.cloud.database()
    Dialog.confirm({
      title: this.data.lottery_info.title,
      message: '充值码:'+this.data.lottery_info.CDKEY
    }).then(() => {
      wx.setClipboardData({
        data: this.data.lottery_info.CDKEY,
        success(res) {
        }
      })
      wx.setStorage({
        key: 'lotteryed',
        data: this.data.lottery_info._id
      })
    }).catch(() => {
      console.log("2")
    });
  },

  // 转发
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: 'Steam点卡抽取',
      path: 'pages/lottery-details/index?id'+this.data.lotteryId,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

})