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
    this.getInfoNew(1)
  },
  getImage(url) {
    // 把现在的图片连接传进来，返回一个不受限制的路径
    if (url !== undefined) {
      url = 'http://' + url.replace(/https:\/\//g, '')
      return 'https://images.weserv.nl/?url=' + url + '&errorredirect=http://www.whoisyours.cn/blog/Minion-Stuart-404.jpg?blog'
    }
  },
  // https://cowlevel.net/search/game-search?per_page=10&page=1&type=1&platform_support_id=183&sort_type=asc&is_free=0&is_discount=1&is_chinese=0
  getInfoNew(page){
    var that = this
    wx.request({
      url: 'https://cowlevel.net/search/game-search?per_page=20&page='+page+'&type=1&platform_support_id=183&sort_type=asc&is_free=0&is_discount=1&is_chinese=0',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.stopPullDownRefresh()
        var itemsNew = res.data.data.post_list
        for (var i = 0; i < itemsNew.length; i++) {
          itemsNew[i].pic = that.getImage(itemsNew[i].pic)
          itemsNew[i].englishName = itemsNew[i].url_slug.replace(/_/g, ' ');
          for (var j = 0; j < itemsNew[i].game_prices.length; j++) {
            if (itemsNew[i].game_prices[j].data.currency == 'cny') {
              itemsNew[i].game_prices = itemsNew[i].game_prices[j]
            }
          }
        }
        that.setData({
          itemsNew: that.data.itemsNew.concat(itemsNew)
        })
      }
    })
  },
  getInfo(page){
    var that = this
    wx.request({
      url: 'https://cowlevel.net/search/game-search?per_page=20&page=' + page + '&type=5&q=&platform_support_id=183&sort_type=desc&is_free=0&is_discount=1&is_chinese=0',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.stopPullDownRefresh()
        var items = res.data.data.post_list
        for (var i = 0; i < items.length; i++) {
          items[i].pic = that.getImage(items[i].pic)
          items[i].englishName = items[i].url_slug.replace(/_/g, ' ')
          for (var j = 0; j < items[i].game_prices.length; j++) {
            if (items[i].game_prices[j].data.currency == 'cny') {
              items[i].game_prices = items[i].game_prices[j]
            }
          }
        }
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