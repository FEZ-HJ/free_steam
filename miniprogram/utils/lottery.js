var util = require('/util.js')
const { URL} = getApp();


// 存入抽奖次数
const addLotteryRecord = (that) => {
  wx.request({
    url: URL + 'lottery/saveRecord',
    data:{
      openId: that.data.userInfo.openId,
      nickName: that.data.userInfo.nickName,
      avatarUrl: that.data.userInfo.avatarUrl,
      uid: that.data.lottery_info[0]._id
    },
    method:'POST',
    success(res) {
      console.log('存入抽奖次数成功:')
    }
  })
}

// 查询正在进行的抽奖
const getLotteryContent = (that) => {
  wx.request({
    url: URL + 'lottery/findUnderway',
    success(res) {
      console.log('查询正在进行的抽奖成功:')
      console.log(res)
      that.setData({
        lottery_info: res.data
      })
    }
  })
}

module.exports = {
  getLotteryContent: getLotteryContent,
  addLotteryRecord: addLotteryRecord
}