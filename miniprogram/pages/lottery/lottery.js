var prizeUtil = require('../../utils/prize.js')

Page({
  data: {
    nomore: false,
    page: 0,
    prizes : [
      
    ],
  },

  onLoad: function (options) {
    prizeUtil.getAllPrize(this.data.page,20,this)
  },

  onReachBottom: function () {
    if (!this.data.nomore) {
      this.setData({
        page: this.data.page + 1 
      })
      prizeUtil.getAllPrize(this.data.page,20,this)
    }
  },

  onShareAppMessage() {
    return {
      title: 'Steam限免助手',
      path: 'pages/index/index'
    }
  },

  skipContent: function (e) {
    wx.navigateTo({
      url: '../lottery-details/index?id=' + e.currentTarget.dataset.replyType
    })
  },

})