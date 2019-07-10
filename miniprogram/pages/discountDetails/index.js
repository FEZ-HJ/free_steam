// miniprogram/pages/discountDetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operation: '展开',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      info: wx.getStorageSync('discountDetails'),
      content: wx.getStorageSync('discountDetails').brief_content == undefined ? wx.getStorageSync('discountDetails').content :
        wx.getStorageSync('discountDetails').brief_content.desc
    })

  },
  unfold: function () {
    this.setData({
      content: this.data.info.content == this.data.content ? this.data.info.brief_content.desc : this.data.info.content,
      operation: this.data.operation == '展开' ? '收起' : '展开'
    })
  },
  errorImage:function(e){
    var info = this.data.info
    info.pic = 'https://' + this.data.info.pic.replace(/https:\/\//g, '');
    this.setData({
      info:info
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