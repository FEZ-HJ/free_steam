var util = require('../../utils/util.js')
const { URL } = getApp();
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
      // 回调父层的onClickHandler函数
      this.triggerEvent('onClickHandler', e, {});
      wx.request({
        url: URL + 'push/insert',
        method: 'POST',
        data: {
          openId: util.getOpenId(),
          formId: e.detail.formId
        },
        success(res) {
          console.log('保存表单ID成功:')
        }
      }) 
    },
    onGotUserInfo: function (e) {
      if (e.detail.userInfo != undefined) {
        util.saveUserInfo(e)
        this.triggerEvent('onGotUserInfo', e, {});
      }
    },

  }
})
