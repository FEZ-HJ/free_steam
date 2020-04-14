Page({

  /**
   * 页面的初始数据
   */
  data: {
    lottery_info:{
      title: '巫师3',
      desc: '满600人即刻开奖',
      img: 'https://media.st.dl.eccdnx.com/steam/apps/292030/header.jpg?t=1581375222',
      attended: [
        'https://wx.qlogo.cn/mmopen/vi_32/n3E9esUk5rpibaOVus5OLMBuwzqtXQkmm00VfpCVj8zS9X8kVzMVWZzT2phUadVan3wrj6yRqWiaZC1AGoolC2ibA/132',
        'https://thirdwx.qlogo.cn/mmopen/vi_32/Q3auHgzwzM4pfOnQ0H4YzgQpjYw5mBxabDFhnN9UzOFvhOCD1qhRLiaGyiagVHLs3KMgxXE7Niciccmerb7LBggUkw/132',
        'https://wx.qlogo.cn/mmopen/vi_32/Ee3rJFn8tPxGwq8Vlzr0OaUfnbUHyCJt2wFzFTFgI7iaIg42hrfaaIPPRtAvXqL3Gclrl2Du9RTSXtnvIDSOlCg/132',
        'https://wx.qlogo.cn/mmopen/vi_32/8p9dyJCvCMccsjVomaP9C4x4OWia1siajjRlLb9N0ZUPudfRjGUholbm2ickloEWIMexKU8gepPib7tImEG9h7suYw/132'
      ]
    },
    lottery_self_info:{
      isComplete: true,
      invited: [
        'https://wx.qlogo.cn/mmopen/vi_32/n3E9esUk5rpibaOVus5OLMBuwzqtXQkmm00VfpCVj8zS9X8kVzMVWZzT2phUadVan3wrj6yRqWiaZC1AGoolC2ibA/132',
        'https://thirdwx.qlogo.cn/mmopen/vi_32/Q3auHgzwzM4pfOnQ0H4YzgQpjYw5mBxabDFhnN9UzOFvhOCD1qhRLiaGyiagVHLs3KMgxXE7Niciccmerb7LBggUkw/132',
        'https://wx.qlogo.cn/mmopen/vi_32/Ee3rJFn8tPxGwq8Vlzr0OaUfnbUHyCJt2wFzFTFgI7iaIg42hrfaaIPPRtAvXqL3Gclrl2Du9RTSXtnvIDSOlCg/132',
        'https://wx.qlogo.cn/mmopen/vi_32/Ee3rJFn8tPxGwq8Vlzr0OaUfnbUHyCJt2wFzFTFgI7iaIg42hrfaaIPPRtAvXqL3Gclrl2Du9RTSXtnvIDSOlCg/132',
        'https://wx.qlogo.cn/mmopen/vi_32/Ee3rJFn8tPxGwq8Vlzr0OaUfnbUHyCJt2wFzFTFgI7iaIg42hrfaaIPPRtAvXqL3Gclrl2Du9RTSXtnvIDSOlCg/132',
        'https://wx.qlogo.cn/mmopen/vi_32/Ee3rJFn8tPxGwq8Vlzr0OaUfnbUHyCJt2wFzFTFgI7iaIg42hrfaaIPPRtAvXqL3Gclrl2Du9RTSXtnvIDSOlCg/132',
        'https://wx.qlogo.cn/mmopen/vi_32/8p9dyJCvCMccsjVomaP9C4x4OWia1siajjRlLb9N0ZUPudfRjGUholbm2ickloEWIMexKU8gepPib7tImEG9h7suYw/132'
      ]
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.openId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.lottery_info.title,
      path: '/pages/test/test?openId=123'
    }
  }
})