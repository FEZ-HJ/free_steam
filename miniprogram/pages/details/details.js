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
    console.log(111)
    this.setData({
      content: this.data.fullContent == this.data.content ? this.data.shortContent : this.data.fullContent,
      operation: this.data.operation == '展开' ? '收起' : '展开'
    })
  },
  query: function (options) {
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    db.collection('jiudaoxiaoyang').where({
      _id: _.eq(options.id)
    }).get({
      success: res => {
        console.log(res.data)
        if (res.data.length > 0) {
          that.setData({
            fullContent: res.data[0].content,
            shortContent: res.data[0].content.substring(0, 120),
            content: res.data[0].content.substring(0, 120),
            title: res.data[0].chineseName,
            desc: res.data[0].englishName,
            language: res.data[0].language,
            tag: res.data[0].tag,
            date: res.data[0].saleDate,
            slider: res.data[0].images,
            allAssess: res.data[0].allAssess,
            assess: res.data[0].assess,
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
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