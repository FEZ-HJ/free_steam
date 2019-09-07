// miniprogram/pages/discount/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[],
    itemsNew:[],
    page:1,
    pageNew:1,
    active: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo(1)
    // this.getInfoNew(1)
  },
  getImage(url) {
    // 把现在的图片连接传进来，返回一个不受限制的路径
    if (url !== undefined) {
      url = 'http://' + url.replace(/https:\/\//g, '')
      return 'https://images.weserv.nl/?url=' + url + '&errorredirect=http://www.whoisyours.cn/blog/Minion-Stuart-404.jpg?blog'
    }
  },
  // https://cowlevel.net/search/game-search?per_page=10&page=1&type=1&platform_support_id=183&sort_type=asc&is_free=0&is_discount=1&is_chinese=0
  getInfo(page){
    var that = this
    wx.request({
      url: 'https://api.xiaoheihe.cn/game/get_game_list_v3/?filter_price=lowest_price&filter_tag=all&filter_platform=all&only_chinese=0&show_dlc=0&sort_type=discount&lang=zh-cn&os_type=iOS&os_version=12.3.1&_time=1566997161&version=1.2.79&device_id=8CF0A451-04EF-4BB0-9EEB-18FDFA29E9D5&heybox_id=-1&hkey=55c666afa4f416df170bb4b8dc33cc60&include_filter=0&limit=30&offset=' + (page - 1) * 30,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        wx.stopPullDownRefresh()
        var items = res.data.result.games
        that.setData({
          items: that.data.items.concat(items)
        })
      }
    })
  },
  onChange(event) {
    this.setData({
      active: event.detail.index
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    if(this.data.active == 0){
      this.setData({
        items:[],
        page:1
      })
      this.getInfo(1)
    } else if (this.data.active == 1){
      this.setData({
        itemsNew: [],
        pageNew:1
      })
      this.getInfoNew(1)
    }
    console.log('开始下拉刷新')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.active == 0) {
      this.getInfo(this.data.page + 1)
      this.setData({
        page: this.data.page + 1
      })
    } else if (this.data.active == 1) {
      this.getInfoNew(this.data.pageNew + 1)
      this.setData({
        pageNew: this.data.pageNew + 1
      })
    }   
  },
  details:function(e){
    wx.setStorageSync("discountDetails", e.target.dataset.replyType)
    if (wx.getStorageSync("discountDetails") == ''){
      console.log(11)
    }else{
      wx.navigateTo({
        url: '../discountDetails/index'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})