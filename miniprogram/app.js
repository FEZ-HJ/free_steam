// 1. 引入vPush核心文件
const vPush = require("./vpush-pro-sdk/vpush.pro.js");


App({
  vPush: new vPush('wxc78e9d02efadbba9'),
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
  }
})
