// vpush-pro-sdk/components/view.js
const { vPush } = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  externalClasses: ['custom-class'],

  /**
   * 组件的初始数据
   */
  data: {
    show:false
  },

  lifetimes: {
    attached: function () {
      var that = this
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            show:true
          })
        },
        fail: function () {
          that.setData({
            show: false
          })
        }
      })
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
      vPush.addFormId(e);
      // 回调父层的onClickHandler函数
      this.triggerEvent('ClickHandler', e, {});
    },
    onGotUserInfo: function (e) {
      if (e.detail.userInfo != undefined){
        this.setData({
          show: true
        })
      }
    },

  }
})
