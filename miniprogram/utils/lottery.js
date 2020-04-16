var util = require('/util.js')
const { URL} = getApp();


// 存入抽奖次数
const addLotteryRecord = (that,lotteryId) => {
  wx.request({
    url: URL + 'prize/insertRecord',
    data:{
      openId: util.getOpenId(),
      prizeId: lotteryId
    },
    method:'POST',
    success(res) {
      that.setData({
        lottery_recordSelf: res.data.myRecord,
        lottery_record: res.data.records
      })
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

const getContentAndRecord = (id,that) => {
  wx.request({
    url: URL + 'lottery/index?id='+id,
    success(res) {
      console.log('查询抽奖详情和记录:')
      console.log(res)
      that.setData({
        lottery_info: res.data.lotteryContent,
        lottery_record: res.data.records
      })
    }
  })
}

const getLotteryRecordSelf = (id,that) => {
  wx.request({
    url: URL + 'lottery/findByOpenIdAndUid?openId='+util.getOpenId()+'&id='+id,
    success(res) {
      console.log('查询本人的抽奖情况:')
      console.log(res)
      that.setData({
        lottery_recordSelf: res.data,
      })
    }
  })
}

// 查询所有抽奖记录
const getAllLotteryContent = (page,size,that) => {
  wx.request({
    url: URL + 'prize/findAllContent?size='+size+'&page='+page,
    success(res) {
      console.log('查询全部的抽奖信息:')
      console.log(res)
      that.setData({
        lottery_info: res.data,
      })
    }
  })
}

// 查询抽奖详情
const getPrizeDetail = (id,that) => {
  wx.request({
    url: URL + 'prize/prizeDetail?id='+id,
    success(res) {
      console.log('查询全部的抽奖信息:')
      console.log(res)
      that.setData({
        lottery_info: res.data,
      })
    }
  })
}

module.exports = {
  getLotteryContent: getLotteryContent,
  addLotteryRecord: addLotteryRecord,
  getContentAndRecord: getContentAndRecord,
  getLotteryRecordSelf: getLotteryRecordSelf,
  getAllLotteryContent: getAllLotteryContent,
  getPrizeDetail: getPrizeDetail,
}