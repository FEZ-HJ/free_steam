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
    onGotUserInfo: function (e) {
      // 获取登录信息后不调用
      if (e.detail.userInfo != undefined) {
        util.saveUserInfo(e)
        this.triggerEvent('onGotUserInfo', e, {});
      }
    },
  }
})
