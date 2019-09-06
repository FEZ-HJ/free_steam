// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const result = {
  code: '',
  body: ''
}
// 云函数入口函数
exports.main = async (event, context) => {
  let { OPENID, APPID } = cloud.getWXContext()
  let { formId,date,type } = event

  return new Promise((resolve, reject) => {
    db.collection('push').add({
      data: {
        _openid: OPENID,
        formId: formId,
        date: date,
        type: type
      }
    }).then((res) => {
      result.code = 200
      result.body = res
      resolve(result)
    })
  })
}