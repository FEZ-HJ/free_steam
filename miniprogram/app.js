const grades = [0, 120, 360, 360, 480, 600, 960, 1320, 1680, 2040, 2400, 2760, 3120, 3480, 3840, 4200, 8280, 9600, 12000, 14400, 15000, 20000, 25000, 30000, 35000, 45000, 55000, 65000, 75000, 85000];

const levels = [0, 120, 480, 840, 1320, 1920, 2880, 4200, 5880, 7920, 10320, 13080, 16200, 19680, 23520, 27720, 36000, 45600, 57600, 72000, 87000, 107000, 132000, 162000, 197000, 242000, 297000, 362000, 437000, 522000]

const addMaxScore = 100;
const addMinScore = 50;

const URL = "http://localhost/steamfree/";
// const URL = "https://steamfree.online/steamfree/";


App({
  grades: grades,
  levels: levels,
  addMaxScore: addMaxScore,
  addMinScore: addMinScore,
  URL: URL,
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
