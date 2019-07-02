// miniprogram/pages/lottery-history/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLotteryContent()

  },

  getLotteryContent: function () {
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    db.collection('lottery-content').orderBy('_id','desc').get({
      success: res => {
        that.setData({
          lottery_info: res.data
        })
        console.log("查询抽奖信息成功")
      },
      fail: console.error
    })
  },

  skipContent: function(e){
    wx.navigateTo({
      url: '../lottery-details/index?id=' + e.currentTarget.dataset.replyType
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})