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
  let { avatarUrl, city, country, gender, language, nickName, province} = event
  
  return new Promise((resolve, reject) => {
    db.collection('userInfo').where({
      _openid: OPENID
    }).get().then((res) => {
      if (!res.data.length) {
        db.collection('userInfo').add({
          data: { 
            _openid:OPENID,
            data: {
              avatarUrl: avatarUrl,
              city: city,
              country: country,
              gender: gender,
              language: language,
              nickName: nickName,
              province: province
            } 
          },
        }).then((res) => {
          result.code = 200
          result.body = res
          // result.openid = userInfo
          resolve(result)
        })
      }
    })
  })
}