// miniprogram/pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lotteryContent : false,
    active: 0,
    md: ''
  },
  onChange(event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.index + 1}`,
    //   icon: 'none'
    // });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLotteryContent()
  },

  // 查询抽奖信息 
  getLotteryContent: function () {
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    db.collection('lottery-content').orderBy('_id', 'desc').get({
      success: res => {
        that.setData({
          _id: res.data[0]._id,
          title: res.data[0].title,
          desc: res.data[0].desc,
          img: res.data[0].img,
          sort: res.data[0].sort
        })
        console.log("查询抽奖信息成功")
      },
      fail: console.error
    })
  },

  // 提交信息 
  submit: function(){
    const db = wx.cloud.database()
    db.collection('lottery-content').add({
      data: {
        _id: this.data._id,
        title: this.data.title,
        desc: this.data.desc,
        img: this.data.img,
        sort: this.data.sort
      }
    }).then((res) => {
      console.log(res)
    })
  },

  idInput: function(e){
    this.setData({
      _id: e.detail
    })
  },
  titleInput: function (e) {
    this.setData({
      title: e.detail
    })
  },
  descInput: function (e) {
    this.setData({
      desc: e.detail
    })
  },
  imgInput: function (e) {
    this.setData({
      img: e.detail
    })
  },
  sortInput: function (e) {
    this.setData({
      sort: e.detail
    })
  },
  lotteryIdInput: function (e) {
    this.setData({
      lotteryId: e.detail
    })
  },
  CDKeyInput: function (e) {
    this.setData({
      CDKey: e.detail
    })
  },
  // 查询全部抽奖记录
  getLotteryRecord: function (id) {
    var that = this
    wx.cloud.callFunction({
      name: 'queryLotteryRecord',
      data: {
        uid: id,
      },
      success: function (res) {
        that.setData({
          lottery_record: res.result.data
        })
        console.log("查询抽奖记录成功")
      },
      fail: console.error
    })
  },

  queryLottery: function(e){
    this.getLotteryRecord(e.detail)
  },

  onClickIcon:function(e){
    var id = e.currentTarget.dataset.replyType
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    db.collection('lottery-record').where({ _id: id }).get({
      success: res => {

        console.log(res.data)
        db.collection('lottery-content').doc(this.data.lotteryId).update({
          data: {
            avatarUrl: res.data[0].avatarUrl,
            nickName: res.data[0].nickName,
            time: res.data[0].time,
            openid: res.data[0]._openid,
            CDKEY: that.data.CDKey
          },
          success: res => {
          },
          fail: console.error
        })
      },
      fail: console.error
    })
  }
})