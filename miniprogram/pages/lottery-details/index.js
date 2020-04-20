var prizeUtil = require('../../utils/prize.js')
var util = require('../../utils/util.js')
import Toast from '../../dist/toast/toast';
let rewardedVideoAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: ['1','2','3','4'],//图文教程下拉框打开
    secretKey: '',                 //输入的密钥--双向绑定
    isBorder : false,              //无边框
    isCourse: false,               //密钥获取教程页面是否打开
    prizeContent:{                 //奖品信息
      title: '巫师3',              //奖品标题
      detail: '满600人即刻开奖',      //奖品描述
      img: 'https://media.st.dl.eccdnx.com/steam/apps/292030/header.jpg?t=1581375222',//奖品图片
      isAd: '否',                  //是否是密钥抽奖
      secretKey: 'Python',         //密钥
    },
    count : 0,                     //抽奖总人数
    recordList:[],                 //抽奖人员
    showGetUserInfo: false,
    showCdk: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      prizeId : options.id,
      openId: wx.getStorageSync('openId')
    })

    // 查询奖品详情
    prizeUtil.getPrizeDetail(this.data.prizeId,this.data.openId,this);

    if (wx.createRewardedVideoAd) {
      rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-edff7554604c2e77',
        multiton: true
      })
      rewardedVideoAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      rewardedVideoAd.onError((err) => {
        console.log('onError event emit', err)
      })
      rewardedVideoAd.onClose((res) => {
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          prizeUtil.addPrizeRecord(this,this.data.prizeId);
          Toast('抽奖成功');
        } else {
          Toast('观看完整广告才可参与抽奖！');
        }
      })
    }

  },

  // 抽奖 分为密钥抽奖和普通抽奖
  lotteryClick: function () {
    if(wx.getStorageSync('userInfo') == ''){
      this.setData({
        showGetUserInfo : true
      })
      return;
    }

    // 如果是密钥抽奖，则先检测密钥
    if (this.data.prizeContent.isAd == '是' && wx.getStorageSync('secretKey') != this.data.prizeContent.secretKey){
      this.setData({
        show: true
      })
      return;
    }
    this.lottery();  
  },

// 检验密钥
  onConfirm: function(){
    if (this.data.secretKey == this.data.prizeContent.secretKey){
      wx.setStorage({
        key: "secretKey",
        data: this.data.secretKey
      })
      this.lottery(); 
    }else{
      Toast('请输入正确的密钥！');
    }
  },


// 获取用户推送授权并看广告
  lottery: function(){
    // 获取推送权限请求
    wx.requestSubscribeMessage({
      tmplIds: ['WLEUt7RlWpbMCi3-A_hT-uRq5w3hGInxbKRhZ42SZT0'],
      success(res) {
        console.log(res)
      }
    })

    // 观看广告，参与抽奖
    rewardedVideoAd.show().catch(() => {
      rewardedVideoAd.load()
        .then(() => rewardedVideoAd.show())
        .catch(err => {
          console.log('激励视频 广告显示失败')
        })
    })
  },

  // 用户授权信息之后，保存用户信息，抽奖
  hasGottenUserInfo: function () {
    this.setData({
      showGetUserInfo: false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.prizeContent.title,
      path: '/pages/lottery-details/index?id=' + this.data.prizeId
    }
  },

// 密钥双向绑定
  secretKeyOnchange(event) {
    this.setData({
      secretKey: event.detail
    })
  },

// 打开密钥获取页面
  course(){
    this.setData({
      isCourse: true
    })
  },

// 关闭密钥获取页面
  courseClose(){
    this.setData({
      isCourse : false
    })
  },

// 跳转到图文详情教程
  courseDetails(){
    wx.navigateTo({
      url: '../course/course'
    })
  },

  // 跳转到抽奖人员详情页面
  lotteryPeopleList(e){
    wx.navigateTo({
      url: '../lottery-people-list/lottery-people-list?prizeId='+ e.currentTarget.dataset.replyType
    })
  },

  // 关闭用户授权页面
  onCloseGetUserInfo() {
    this.setData({ showGetUserInfo: false });
  },

  getPrize(){
    wx.setClipboardData({
      data: this.data.prizeContent.cdk,
      success (res) {
        wx.getClipboardData({
          success (res) {
          }
        })
      }
    })
    this.setData({
      showCdk:true
    })
  },
  onCloseCdk(){
    this.setData({
      showCdk:false
    })
  },


})