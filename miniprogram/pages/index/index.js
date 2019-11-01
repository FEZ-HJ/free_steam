// miniprogram/pages/index/index.js
const { URL } = getApp();
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.getOpenId(this)
    this.query()
    this.getHomePage()
    util.getUserInfo(this)
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
    var that = this
    wx.request({
      url: URL+ 'freeGame/findAll?page=1&limit=10',
      success(res) {
        console.log('限免信息:')
        console.log(res.data.data)
        that.setData({
          items: res.data.data
        })
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
    if (this.data.userInfo != undefined && (this.data.userInfo.avatarUrl ==             'https://wx.qlogo.cn/mmopen/vi_32/7Fy64zYiczszwKEqzjOnSFhWequlYPDQsEw8X1eR1lasmpTAH8q7pYoZOiaiao9V8MyAWNcBwq6CY6K5j1TrswVzQ/132' || 
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

// 下拉刷新
  onPullDownRefresh(){
    console.log('开始下拉刷新')
    this.query()
  },

})