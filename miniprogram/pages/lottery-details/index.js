// miniprogram/pages/lottery-details/index.js
import Toast from '../../dist/toast/toast';
let rewardedVideoAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo(options.id)
    this.hasGottenUserInfo()
    this.setData({
      lotteryId: options.id
    })
    this.getLotteryContent(options.id)
    this.getLotteryRecord(options.id)

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
        console.log(res)
        that.setData({
          lottery_record: res.result.data
        })
        console.log("查询抽奖记录成功")
      },
      fail: console.error
    })
  },

  // 查询当前用户抽奖记录
  getLotteryRecordSelf: function (id,openid) {
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    db.collection('lottery-record').where({
      uid: _.eq(id),
      _openid: _.eq(openid),
    }).get({
      success: res => {
        that.setData({
          lottery_recordSelf: res.data[0]
        })
        console.log("查询抽奖信息成功")
      },
      fail: console.error
    })
  },

  // 查询用户信息
  hasGottenUserInfo: function () {
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

  // 用户授权
  onGotUserInfo: function (e) {
    if (e.detail.userInfo != undefined) {
      this.setData({
        userInfo: e.detail.userInfo
      })
      const db = wx.cloud.database()
      db.collection('userInfo').add({
        data: { data: e.detail.userInfo },
        success: res => {
          console.log("存入用户信息成功")
        },
      })
      this.lottery()
    }else{
      Toast('授权之后才能参与抽奖哦！');
    }
  },

  // 抽奖详情
  lottery: function () {
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

  // 查询用户openID
  getUserInfo :function(id){
    var that = this
    wx.cloud.callFunction({
      name: 'getUserInfo',
      success: function (res) {
        that.setData({
          _openid: res.result.openid
        })
        that.getLotteryRecordSelf(id, res.result.openid)
      },
      fail: console.error
    })
  }
})