var prizeUtil = require('../../utils/prize.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page : 0,
    nomore: false,
    prizeRecord:[]
  },

  onLoad: function (options) {
    this.setData({
      prizeId : options.prizeId
    })
    prizeUtil.getPrizeRecord(options.prizeId,this.data.page,50,this)
  },

  onReachBottom: function () {
    if (!this.data.nomore) {
      this.setData({
        page: this.data.page + 1 
      })
      prizeUtil.getPrizeRecord(this.data.prizeId,this.data.page,50,this)
    }
  },

})