var util = require('../../utils/util.js')
import Dialog from '../../dist/dialog/dialog';

Page({
  data:{
    show: true,
    activeNames: ['']
  },
  // 下拉展示
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  onLoad: function (e) {
    console.log(wx.getStorageSync('signInData'))
    //设置日期样式
    if (wx.getStorageSync('signInData') != ''){
      this.setDays(util.formatDay(new Date()).substring(0, 7))
    }else{
      this.querySignDate()
    }
      
    // 设置签到按钮展示
    if (util.formatDay(new Date()) == wx.getStorageSync('isDate')){
      this.setData({
        show: false
      })
    }
  },

  //改变月份
  dateChange: function(e){
    this.setData({
      days: []
    })
    var year = e.detail.currentYear
    var month = util.formatNumber(e.detail.currentMonth)
    this.setDays(year+"-"+month)
  },
  
  //设置日历日期样式
  setDays:function(month){
    var days = [];
    var signInData = wx.getStorageSync('signInData')
    console.log(signInData)
    for (var i = 0; i < signInData.length; i++) {
      if (signInData[i].indexOf(month) >= 0) {
        days.push({
          month: 'current',
          day: signInData[i].substring(8, 10),
          color: 'white',
          background: '#0080FF'
        })
      }
    }
    this.setData({
      days: days
    })
  },

  // 存入签到日期
  checkIn: function () {
    var that  = this
    wx.cloud.callFunction({
      name: 'addAndInsert',
      data: {
        date: util.formatDay(new Date()),
      },
      success: function (res) {
        that.querySignDate()
      },
      fail: console.error
    })
    console.log("签到")
  },

  // 推送功能
  customHandler: function (e) {
    wx.setStorage({
      key: 'isDate',
      data: util.formatDay(new Date())
    })
    this.checkIn()
    Dialog.alert({
      message: '开启推送成功！因小程序设置，此次开启只能保证7天内接受一次推送'
    }).then(() => {
      // on close
    });
    this.setData({
      show: false
    })
  },

  // 查询签到日期
  querySignDate: function(){
    var that = this
    const db = wx.cloud.database()
    db.collection('signIn').get({
      success: res => {
        wx.setStorage({
          key: 'signInData',
          data: res.data[0].data,
        })
        that.setDays(util.formatDay(new Date()).substring(0, 7))
      },
      fail: console.error
    })
  }

});