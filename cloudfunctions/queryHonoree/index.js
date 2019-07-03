// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  let { OPENID, APPID } = cloud.getWXContext()

  return await db.collection('lottery-content').where({
    _openid: OPENID,
    isEnd: _.eq(null)
  }).get()
}