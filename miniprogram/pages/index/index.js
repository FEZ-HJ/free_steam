// miniprogram/pages/index/index.js
import Dialog from '../../dist/dialog/dialog';
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
    this.query()
  },

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
          var isshow = wx.getStorageSync('isShow')
          var isdate = wx.getStorageSync('isDate')
          var i = util.duration(isdate, util.formatDay(new Date()))
          if (isshow == that.data.items[0]._id && i < 7) {
            that.setData({
              show: false
            })
          }
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

  collect: function (e) {
    wx.navigateTo({
      url: '../details/details?id='+ e.currentTarget.dataset.replyType
    })
  },

  customHandler: function (e) {
    wx.setStorage({
      key: 'isShow',
      data: this.data.items[0]._id
    })
    wx.setStorage({
      key: 'isDate',
      data: util.formatDay(new Date())
    })
    Dialog.alert({
      message: '开启推送成功！因小程序设置，此次开启只能保证7天内接受一次推送'
    }).then(() => {
      // on close
    });
    this.setData({
      show: false
    })
  },

  onSearch:function(e){
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    console.log(this.data.value)
    db.collection('jiudaoxiaoyang').where({
      chineseName: db.RegExp({
        regexp: e.detail,
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
  }

})