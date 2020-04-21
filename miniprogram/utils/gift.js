const { URL} = getApp();

// 查询所有抽奖记录
const getAllGift = (that) => {
  wx.request({
    url: URL + 'gift/list',
    success(res) {
      console.log('查询所有抽奖记录:')
      console.log(res)
      that.setData({
        giftContents: res.data,
      })
    }
  })
}

// 存入抽奖次数
const addConvertRecord = (that,prizeId) => {
  wx.request({
    url: URL + 'prize/insertRecord',
    data:{
      openId: wx.getStorageSync('openId'),
      prizeId: prizeId
    },
    method:'POST',
    success(res) {
      that.setData({
        count: res.data.count,
        recordList: res.data.list
      })
      console.log('存入抽奖次数成功:')
    }
  })
}

// 查询兑换记录
const giftRecord = (that) => {
  wx.request({
    url: URL + 'gift/giftRecord?openId='+wx.getStorageSync('openId'),
    success(res) {
      console.log('查询兑换记录:')
      console.log(res)
      that.setData({
        giftRecord: res.data,
      })
    }
  })
}

// 查询中奖记录
const winnersRecord = (that) => {
  wx.request({
    url: URL + 'prize/winnersRecord?openId='+wx.getStorageSync('openId'),
    success(res) {
      console.log('查询中奖记录:')
      console.log(res)
      that.setData({
        winnersRecord: res.data,
      })
    }
  })
}


module.exports = {
  getAllGift: getAllGift,
  addConvertRecord: addConvertRecord,
  winnersRecord: winnersRecord,
  giftRecord: giftRecord,
}