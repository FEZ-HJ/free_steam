const { URL } = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图
    homepage:['http://cdn.steamfree.online/de75c6bc08a35a14c1812ba333091ba.png'],
    // 中奖信息
    honoreeInfo:null,
    // 限免信息
    items:null,
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.query()
    this.queryHomePage()
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

//初始化 查询所有首页轮播图
queryHomePage: function () {
  console.log('开始查询首页轮播图')
  var that = this
  wx.request({
    url: URL+ 'homepage',
    success(res) {
      console.log('首页轮播图:')
      console.log(res.data)
      that.setData({
        homepage: res.data
      })
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

  homepageClick(e){
    console.log(e.currentTarget.dataset.replyType)
    if(e.currentTarget.dataset.replyType == '' || e.currentTarget.dataset.replyType == undefined){
      this.setData({
        show : true
      })
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.replyType
      })
    }
    
  }

})