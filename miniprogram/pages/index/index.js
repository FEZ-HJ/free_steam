const { URL } = getApp();
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
    this.query()
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
      url: URL+ 'freeGame/findAll?page=1&limit=100',
      success(res) {
        console.log('限免信息:')
        console.log(res.data.data)
        that.setData({
          items: res.data.data
        })
        wx.stopPullDownRefresh();
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

  onClose:function(){
    this.setData({
      show: false
    })
  },

// 下拉刷新
  onPullDownRefresh(){
    console.log('开始下拉刷新')
    this.query()
  },

})