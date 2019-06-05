var util = require('../../utils/util.js')

Page({
  data:{
    days:[{
      month:'current',
      day:'05',
      color:'white',
      background:'#0080FF'
    }],
  },

  onLoad: function (e) {
    const db = wx.cloud.database()
    var days = [];
    var that  = this
    db.collection('signIn').get({
      success: res => {
        this.setData({
          record: res.data[0].data
        })
        for (var i = 0; i < res.data[0].data.length; i++) {
          if (res.data[0].data[i].indexOf(util.formatDay(new Date()).substring(0, 7)) >= 0) {
            days.push({
              month: 'current',
              day: res.data[0].data[i].substring(8, 10),
              color: 'white',
              background: '#0080FF'
            })
          }
        }
        this.setData({
          days: days
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })

    // util.formatDay(new Date()).substring(0,7)
    // this.setDays(util.formatDay(new Date()).substring(0, 7))
  },

  dateChange: function(e){
    this.setData({
      days: []
    })
    var year = e.detail.currentYear
    var month = util.formatNumber(e.detail.currentMonth)
    this.setDays(year+"-"+month)
  },
  
  setDays:function(month){
    var days = [];
    for (var i = 0; i < this.data.record.length; i++) {
      if (this.data.record[i].indexOf(month) >= 0) {
        days.push({
          month: 'current',
          day: this.data.record[i].substring(8, 10),
          color: 'white',
          background: '#0080FF'
        })
      }
    }
    this.setData({
      days: days
    })
  }

});