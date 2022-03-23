var util = require('utils/util.js');
import tracker from './utils/tracker.js';
var api = require('config/api.js');

  
const options = {
    data: {
        deviceInfo: {}
    },
    onLaunch: function() {
      
        // tracker.setUnionID('ogqd56Hbql6Ioj51-3fhfjfiBNRU')
        this.data.deviceInfo = wx.getSystemInfoSync();
        console.log(this.data.deviceInfo);
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        // 登录
        wx.login({
            success: res => {
                console.log(res)
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
        let that = this;
        wx.getSystemInfo({ //  获取页面的有关信息
            success: function(res) {
                wx.setStorageSync('systemInfo', res)
                var ww = res.windowWidth;
                var hh = res.windowHeight;
                that.globalData.ww = ww;
                that.globalData.hh = hh;
            }
        });

    },
    globalData: {
        userInfo: {
            nickname: '点我登录',
            username: '点击登录',
            avatar: 'http://lucky-icon.meiweiyuxian.com/hio/default_avatar_big.png'
        },
        token: '',
    }

}

tracker.init({
    isDebug: true,
    autoTrack: { // 删除该设置项即保持默认配置
      appLaunch: true, // App onLaunch的生命周期监测，如首次打开小程序
      appShow: true, // App onShow的生命周期监测，如小程序进入前台
      appError: true, // App onError的事件监测
      appHide: true, // App onHide的生命周期监测，如小程序进入前台后台、关闭、进程关闭
      pageLoad: true, // Page onLoad的生命周期监测，不发送数据，使用ABTest则必须开启
      pageShow: true, // Page onShow的生命周期监测，如小程序内打开页面、从后台进入前台打开页时触发等
      pageHide: true, // Page onHide的生命周期监测，如小程序页面进入后台时触发
      pageShare: true, // Page onShareAppMessage的事件监测，如点击右上角分享时触发
      click: true // WXML中已绑定的点击事件监测，如bindtap、bindlongtap
    },
    profileId: "1XTYzXxzczUjGi1jbMVhRfJqcqCQD0ve", // profileID
    appName: "miniProgram-seaStore", // 应用名
    serviceUrls: [' https://eap-uat.gridsumdissector.com/receiver'] 
    // serviceUrls: ['https://wd5-recv.gridsumdissector.com/receiver'] // 数据接收地址
  })

// tracker.login('oQiQD5c1bdTV9vNeCJywHxjGzXXI')
// tracker.setUser({openid: 'oQiQD5c1bdTV9vNeCJywHxjGzXXI'})
// tracker.setOpenid('oQiQD5c1bdTV9vNeCJywHxjGzXXI');
App(options)