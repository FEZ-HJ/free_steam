// miniprogram/pages/index/index.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    show:true,
    swiperCurrent: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.query()
    this.getHomePage()
    this.getUserInfo()
  },

// 轮播图控制方法
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current,
    })
  },
  //初始化 
  query: function () {
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    db.collection('jiudaoxiaoyang').orderBy('_id', 'desc').get({
      success: res => {
        console.log(res.data)
        if (res.data.length > 0) {
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
      url: '../details/details?id='+ e.currentTarget.dataset.replyType
    })
  },

  // 查询限免内容 
  onSearch:function(e){
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    var name = e ==undefined ? '' : e.detail
    db.collection('jiudaoxiaoyang').where({
      chineseName: db.RegExp({
        regexp: name,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      })
    }).orderBy('_id', 'desc').get({
      success: res => {
        console.log(res.data)
        if (res.data.length > 0) {
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
      }
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
    if(id == '999'){
      wx.previewImage({
        urls: ['http://www.whoisyours.cn/blog/公众号二维码.png?blog'] // 需要预览的图片http链接列表
      })
    }else{
      wx.navigateTo({
        url: '../lottery-details/index?id=' + id
      })
    }
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
  getUserInfo: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'queryHonoree',
      success: function (res) {
        console.log(res)
        that.setData({
          honoreeInfo: res.result.data
        })
      },
      fail: console.error
    })
  },

// 跳转到中奖页面
  honoreeClick:function(e){
    wx.navigateTo({
      url: '../lottery-details/index?id=' + e.currentTarget.dataset.replyType
    })
  },

})