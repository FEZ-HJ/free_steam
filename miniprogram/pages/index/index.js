// miniprogram/pages/index/index.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    show:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onSearch()
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

})