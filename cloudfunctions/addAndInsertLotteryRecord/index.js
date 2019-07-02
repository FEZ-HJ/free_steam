// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const result = {
  code: '',
  body: '',
  openid: ''
}
// 云函数入口函数
exports.main = async (event, context) => {
  let { OPENID, APPID } = cloud.getWXContext()
  let { nickName, avatarUrl, uid } = event

  return new Promise((resolve, reject) => {
    db.collection('lottery-record').where({
      _openid: _.eq(OPENID),
      uid: _.eq(uid)
    }).get().then((res) => {
      if (res.data.length) {
        db.collection('lottery-record').doc(res.data[0]._id).update({
          data: { time: res.data[0].time + 1 }
        }).then((res) => {
          result.code = 200
          result.body = res
          resolve(result)
        })
      } else {
        db.collection('lottery-record').add({
          data: {
            _openid: OPENID,
            time: 1,
            avatarUrl: avatarUrl,
            nickName: nickName,
            uid:uid
          }
        }).then((res) => {
          result.code = 200
          result.body = userInfo
          resolve(result)
        })
      }
    })
  })
}