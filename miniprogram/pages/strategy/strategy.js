// miniprogram/pages/strategy/strategy.js
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
    this.query(options.id)
  },

  query: function(id){
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    db.collection('strategy').where({
      _id: _.eq(id)
    }).get({
      success: res => {
        console.log(res)
        if(res.data.length > 0){
          that.setData({
            content: res.data[0].content.replace(/\^/g,'\n')
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
  }
})