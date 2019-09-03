// miniprogram/pages/index/index.js
var util = require('../../utils/util.js')
var signInUtil = require('../../utils/signIn.js')
import Dialog from '../../dist/dialog/dialog';
import Notify from '../../dist/notify/notify';
import Toast from '../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图
    homepage:null,
    // 中奖信息
    honoreeInfo:null,
    // 限免信息
    items:null,
    show:false,
    signIn:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.query()
    this.getHomePage()
    util.getUserInfo(this)
    // signInUtil.setDays(this,util.formatDay(new Date()).substring(0, 7)) 
  },

  onShow:function(){
    this.queryHonoree()
    // 设置签到按钮展示
    if (util.formatDay(new Date()) == wx.getStorageSync('isDate')) {
      this.setData({
        signIn: false
      })
    }
  },

// 轮播图控制方法
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current,
    })
  },
  //初始化 查询所有限免信息
  query: function () {
    console.log('开始查询限免信息')
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    db.collection('jiudaoxiaoyang').orderBy('_id', 'desc').get({
      success: res => {
        wx.stopPullDownRefresh()
        if (res.data.length > 0) {
          console.log('查询限免信息成功')
          that.setData({
            items: res.data
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

// 跳转到详情页面
  collect: function (e) {
    wx.navigateTo({
      url: '../indexDetails/details?id='+ e.currentTarget.dataset.replyType
    })
  },

// 转发
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: 'Steam限免助手',
      path: 'pages/index/index',
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

// 轮播图点击
  homepageClick:function(e){
    var id = e.currentTarget.dataset.replyType
    if (this.data.userInfo != undefined && (this.data.userInfo.avatarUrl == 'https://wx.qlogo.cn/mmopen/vi_32/7Fy64zYiczszwKEqzjOnSFhWequlYPDQsEw8X1eR1lasmpTAH8q7pYoZOiaiao9V8MyAWNcBwq6CY6K5j1TrswVzQ/132' || 
      this.data.userInfo.avatarUrl == 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI64XUGp3cKv4Gn8SOm6WX7RvgBwErgzWZqFPWqK94XCQZCNjFVsficYZFQ4ukGnqvPrjsG1O4ibDug/132')) {
      wx.navigateTo({
        url: '../setting/setting'
      })
    }
    else if(id == '999'){
      wx.previewImage({
        urls: ['http://www.whoisyours.cn/blog/公众号二维码.png?blog'] // 需要预览的图片http链接列表
      })
    } else if (id == '998'){
      this.setData({
        show:true
      })
    }else{
      wx.navigateTo({
        url: '../lottery-details/index?id=' + id
      })
    }
  },
  onClose:function(){
    this.setData({
      show: false
    })
  },
// 获取首页轮播图
  getHomePage:function(){
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    db.collection('homePage').get({
      success: res => {
        that.setData({
          homepage: res.data
        })
        console.log("查询首页图片成功")
      },
      fail: console.error
    })
  },

// 查询用户中奖信息
  queryHonoree: function () {
    console.log('开始查询用户中奖信息')
    var that = this
    wx.cloud.callFunction({
      name: 'queryHonoree',
      success: function (res) {
        console.log('查询用户中奖信息成功')
        that.setData({
          honoreeInfo: res.result.data
        })
      },
      fail: console.error
    })
  },

// 跳转到中奖页面
  honoreeClick:function(e){
    console.log('跳转到中奖页面')
    wx.navigateTo({
      url: '../lottery-details/index?id=' + e.currentTarget.dataset.replyType
    })
  },

// 下拉刷新
  onPullDownRefresh(){
    console.log('开始下拉刷新')
    this.query()
  },

  signInClose() {
    this.setData({ signIn: false });
  },

  // 签到
  customHandler: function () {
    signInUtil.signInHome(this)
    Notify('连续签到7天以上，经验积分奖励翻倍！');
    var t = parseInt(this.data.continuousDay) + 1
    Toast('已连续签到' + t + '天！');
  },

  // 查询用户信息并签到
  hasGottenUserInfo: function () {
    signInUtil.signInHome(this)
    util.getUserInfo(this)
  },


})