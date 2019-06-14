// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const result = {
  code: '',
  body: '',
  openid:''
}
// 云函数入口函数
exports.main = async (event, context) => {
  let { OPENID, APPID } = cloud.getWXContext()
  let { userInfo, score } = event

  return new Promise((resolve, reject) => {
    db.collection('record').where({
      openid: OPENID
    }).get().then((res) => {
      if (res.data.length) {
        db.collection('record').doc(res.data[0]._id).update({
          data: { score: res.data[0].score + score}
        }).then((res) => {
          result.code = 200
          result.body = res
          resolve(result)
        })
      } else {
        db.collection('record').add({
          data:{
            openid: OPENID,
            score: score
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