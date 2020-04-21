const { URL} = getApp();

// 查询所有抽奖记录
const getPrizeRecord = (id,page,size,that) => {
  wx.request({
    url: URL + 'prize/prizeRecord?id='+id+'&page='+page+'&size='+size,
    success(res) {
      console.log('查询所有抽奖记录:')
      console.log(res)
      if(res.data.length < 50){
        that.setData({
          nomore: true,
        })
      }
      that.setData({
        prizeRecord: that.data.prizeRecord.concat(res.data),
      })
    }
  })
}

// 查询所有奖品
const getAllPrize = (page,size,that) => {
  wx.request({
    url: URL + 'prize/findAllContent?size='+size+'&page='+page,
    success(res) {
      console.log('查询所有奖品:')
      console.log(res)
      if(res.data.length < 20){
        that.setData({
          nomore: true,
        })
      }
      that.setData({
        prizes: that.data.prizes.concat(res.data),
      })
    }
  })
}

// 查询抽奖详情
const getPrizeDetail = (id,openId,that) => {
  wx.request({
    url: URL + 'prize/prizeDetail?id='+id+'&openId='+openId,
    success(res) {
      console.log('查询抽奖详情:')
      console.log(res)
      that.setData({
        prizeContent: res.data.prizeContent,
        count : res.data.count,
        recordList : res.data.list
      })
    }
  })
}

// 存入抽奖次数
const addPrizeRecord = (that,prizeId) => {
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


// 保存推送信息
const pushRecord = (that) => {
  wx.request({
    url: URL + 'push/insert',
    data:{
      openId: wx.getStorageSync('openId'),
      prizeId: that.data.prizeId,
    },
    method:'POST',
    success(res) {
      console.log('保存推送内容:') 
    }
  })
}

module.exports = {
  getAllPrize: getAllPrize,
  getPrizeDetail: getPrizeDetail,
  getPrizeRecord: getPrizeRecord,
  addPrizeRecord: addPrizeRecord,
  pushRecord: pushRecord,
}