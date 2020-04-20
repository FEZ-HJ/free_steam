var util = require('../../utils/util.js')
var signInUtil = require('../../utils/signIn.js')
var giftUtil = require('../../utils/gift.js')
import Dialog from '../../dist/dialog/dialog';
import Notify from '../../dist/notify/notify';
import Toast from '../../dist/toast/toast';
const { URL} = getApp();
let signInoAd = null

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
    signIn: true,
    showGetUserInfo: false
  },

  onShow: function(){
    // 查询签到信息
    signInUtil.getSignInfo(this)
    // 查询奖品信息
    giftUtil.getAllGift(this)
    // 查询兑换信息
    giftUtil.giftRecord(this)
    // 查询中奖信息
    giftUtil.winnersRecord(this)
  },

  onLoad: function (e) {
    // 查询用户信息
    util.setUserInfo(this)
    // 查询抽奖信息 
    // 创建广告
    if (wx.createRewardedVideoAd) {
      signInoAd = wx.createRewardedVideoAd({ 
        adUnitId: 'adunit-edff7554604c2e77',
        multiton: true
        })
      signInoAd.onClose((res) => {
        if (res && res.isEnded) {
          signInUtil.singn(this)
          Notify('连续签到7天以上，经验积分奖励翻倍！');
        } else {
          Toast('观看完整广告才可签到！');
        }
      })
    }

  },

  // 签到
  customHandler: function () {
    if(wx.getStorageSync('userInfo') == ''){
      this.setData({
        showGetUserInfo : true
      })
      return;
    }

    signInoAd.show().catch(() => {
      // 失败重试
      signInoAd.load()
        .then(() => signInoAd.show())
        .catch(err => {
          console.log('激励视频 广告显示失败')
        })
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
    this.setData({
      showGetUserInfo: false
    })
  },

  // 积分兑换 
  convert:function(e){
    var spend = e.currentTarget.dataset.replyType
    if (spend > this.data.money){
      Dialog.alert({ message: '该礼品需要' + spend +'积分,您的积分不足'}).then(() => {});
    }else{
      Dialog.confirm({
        title: '兑换礼品',
        message: '确认兑换：'+e.currentTarget.dataset.replyType1+"吗？"
      }).then(() => {
        wx.request({
          url: URL + 'gift/convertGift?giftId='+e.currentTarget.dataset.replyType2+"&openId="+wx.getStorageSync('openId'),
          method: 'GET',
          success(res) {
            if(res.data.code=='200'){
              wx.setClipboardData({
                data: res.data.giftCdk.cdk,
                success (res) {
                  wx.getClipboardData({
                    success (res) {
                      Notify('奖品兑换成功！激活码已复制到剪贴板');
                    }
                  })
                }
              })
              signInUtil.getSignInfo(this)
              giftUtil.giftRecord(this)
            }else{
              Notify(res.data.message);
            }
          }
        })
      }).catch(() => {
        // on cancel
      });
    }
  },

  // 用户授权
  onGotUserInfo: function (e) {
    if (e.detail.userInfo != undefined) {
      this.setData({
        userInfo: e.detail.userInfo
      })
      util.saveUserInfo(e)
    } else {
      Toast('授权之后才能参与抽奖哦！');
    }
  }
  

});
