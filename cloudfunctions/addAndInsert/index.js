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
  let { userInfo, date } = event

  return new Promise((resolve, reject) => {
    db.collection('signIn').where({
      openid: OPENID
      }).get().then((res)=>{
        if(res.data.length){
          db.collection('signIn').doc(res.data[0]._id).update({
            data: {
              data: _.unshift([date])
            }
          }).then((res)=> {
            result.code = 200
            result.body = res
            resolve(result)
          })
        }else{
          db.collection('signIn').add({
            data: {
              openid: OPENID,
              data: [date]
            }
          }).then((res) => {
            result.code = 200
            result.body = res
            resolve(result)
          })
        } 
    })
  })
}