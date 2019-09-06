const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.templateMessage.send({
      touser: 'obNf945tfBwIoR2k4M1nC18OA6ok',
      page: 'pages/index/index',
      data: {
        keyword1: {
          value: 'ABZU'
        },
        keyword2: {
          value: '68元'
        },
        keyword3: {
          value: '结束时间：2019-06-20'
        }
      },
      templateId: 'pKzInZ9-YAtP5B4YzqU3Jq8g8LUIpjx1dWLRiuDaOD8',
      formId: 'd4a879ee52844377a1af839b52d8c66e',
      emphasisKeyword: 'keyword1.DATA'
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}