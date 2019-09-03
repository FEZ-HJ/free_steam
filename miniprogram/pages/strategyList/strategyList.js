Page({

  /**
   * 页面的初始数据
   */
  data: {
    content : [],
    skipPage : 0,
    moreData : true
  },

  onLoad: function (options) {
    var that = this
    this.getArticleList();
  },
  getArticleList:function() {
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    db.collection('strategy').orderBy('_id', 'desc').skip(this.data.skipPage).get({
      success: res => {
        console.log(res)
        if (res.data.length > 0) {
          that.setData({
            content: that.data.content.concat(res.data)
          })
        }else{
          that.setData({
            moreData : false
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
  onReachBottom: function () {
    if (this.data.moreData) {
      this.setData({
        skipPage: this.data.skipPage + 20 
      })
      this.getArticleList();
    }
  },
  onShareAppMessage() {
    return {
      title: 'Steam限免助手',
      path: 'pages/index/index'
    }
  }
})