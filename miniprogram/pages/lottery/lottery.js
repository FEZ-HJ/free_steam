Page({

  /**
   * 页面的初始数据
   */
  data: {
    lottery_info : [
      {
        id: '1',
        title: '巫师3',
        desc: '满600人即刻开奖',
        status: '进行中',
        img: 'https://media.st.dl.eccdnx.com/steam/apps/292030/header.jpg?t=1581375222'
      },
      {
        id: '2',
        title: '刺客信条2',
        desc: '满300人即刻开奖',
        status: '进行中',
        img: 'https://media.st.dl.eccdnx.com/steam/apps/33230/header.jpg?t=1542638260'
      },
    ],
  },

  onLoad: function (options) {
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
  },

  skipContent: function (e) {
    wx.navigateTo({
      url: '../lottery-details/index?id=' + e.currentTarget.dataset.replyType
    })
  },

})