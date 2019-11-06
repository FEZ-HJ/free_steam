const { URL } = getApp();
Page({
  data: {
    slider: [
      {},
    ],
    swiperCurrent: 0,
    fullContent: '',
    shortContent: '',
    content: '',
    title: '',
    desc: '',
    language: '',
    tag: '',
    date: '',
    operation: '展开',
    article_id: null,
    assess: '',
    allAssess: ''

  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      article_id: options.id
    })
    this.query(options)
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current,
    })
  },
  unfold: function () {
    this.setData({
      content: this.data.fullContent == this.data.content ? this.data.shortContent : this.data.fullContent,
      operation: this.data.operation == '展开' ? '收起' : '展开'
    })
  },
  query: function (options) {
    var that = this
    wx.request({
      url: URL + 'freeGame/findById?id=' + options.id ,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('查询游戏详细信息:')
        console.log(res.data)
        if (res.data != undefined) {
          that.setData({
            fullContent: res.data.content,
            shortContent: res.data.content.substring(0, 120),
            content: res.data.content.substring(0, 120),
            title: res.data.chineseName,
            desc: res.data.englishName,
            language: res.data.language,
            tag: res.data.tag,
            date: res.data.saleDate,
            slider: res.data.images,
            allAssess: res.data.allAssess,
            assess: res.data.assess,
          })
        }
      }
    }) 
  },

  onShareAppMessage: function () {
    let users = wx.getStorageSync('user');
    if (res.from === 'button') { }
    return {
      title: '转发',
      path: '/pages/details/details?id=' + this.data.article_id,
      success: function (res) { }
    }
  }
})