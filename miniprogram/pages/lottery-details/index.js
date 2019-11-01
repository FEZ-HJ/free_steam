// miniprogram/pages/lottery-details/index.js
var util = require('../../utils/util.js')
var lotteryUtil = require('../../utils/lottery.js')
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
    lotteryUtil.getLotteryRecordSelf(options.id,this)
    // 查询用户授权信息
    util.getUserInfo(this)
    // 查询奖品信息和抽奖记录
    lotteryUtil.getContentAndRecord(options.id,this)
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
          lotteryUtil.addLotteryRecord(this,this.data.lotteryId)
        } else {
          Toast('观看完整广告才可参与抽奖！');
        }
      })
    }
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