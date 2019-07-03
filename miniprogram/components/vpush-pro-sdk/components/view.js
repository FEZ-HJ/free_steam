// vpush-pro-sdk/components/view.js
const { vPush } = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: null
  },
  externalClasses: ['custom-class'],

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  lifetimes: {
    attached: function () {
      
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    add: function (e) {     
      // vPush.addFormId(e);
      // 回调父层的onClickHandler函数
      this.triggerEvent('onClickHandler', e, {});
    },
    onGotUserInfo: function (e) {
      if (e.detail.userInfo != undefined){
        wx.cloud.callFunction({
          name: 'setUserInfo',
          data: {
            avatarUrl: e.detail.userInfo.avatarUrl,
            city: e.detail.userInfo.city,
            country: e.detail.userInfo.country,
            gender: e.detail.userInfo.gender,
            language: e.detail.userInfo.language,
            nickName: e.detail.userInfo.nickName,
            province: e.detail.userInfo.province,
          },
          success: function (res) {
            console.log(res)
            console.log("存入用户信息成功")
          },
          fail: console.error
        })
        this.triggerEvent('onGotUserInfo', e, {});
      }
    },

  }
})
