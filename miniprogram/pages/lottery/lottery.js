var lotteryUtil = require('../../utils/lottery.js')

Page({
  data: {
    page: 20,
    lottery_info : [
      {
        id: '1',
        title: '巫师3',
        detail: '满600人即刻开奖',
        status: '进行中',
        img: 'https://media.st.dl.eccdnx.com/steam/apps/292030/header.jpg?t=1581375222'
      },
      {
        id: '2',
        title: '刺客信条2',
        detail: '满300人即刻开奖',
        status: '进行中',
        img: 'https://media.st.dl.eccdnx.com/steam/apps/33230/header.jpg?t=1542638260'
      },
    ],
  },

  onLoad: function (options) {
    lotteryUtil.getAllLotteryContent(0,20,this)
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