const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  let {uid} = event
  // 先取出集合记录总数
  const countResult = await db.collection('lottery-record').count()
  const total = countResult.total
  // 计算需分几次取
  // const batchTimes = Math.ceil(total / 100)
  const batchTimes = 1
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('lottery-record').where({
      uid: _.eq(uid)
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).orderBy('time', 'desc').get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}