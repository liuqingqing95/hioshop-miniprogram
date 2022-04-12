const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
import _gsTracker from '../../utils/tracker.js';

//获取应用实例
const app = getApp()
const options = {
    data: {
        floorGoods: [],
        openAttr: false,
        showChannel: 0,
        showBanner: 0,
        showBannerImg: 0,
        banner: [],
        index_banner_img: 0,
        userInfo: {},
        imgurl: '',
        sysHeight: 0,
        loading: 0,
        autoplay:true,
        showContact:1,
    },
    onPageScroll: function (e) {
        let scrollTop = e.scrollTop;
        let that = this;
        if (scrollTop >= 2000) {
            that.setData({
                showContact: 0
            })
        } else {
            that.setData({
                showContact: 1
            })
        }
    },
    onHide:function(){
        this.setData({
            autoplay:false
        })
    },
    goSearch: function () {
        wx.navigateTo({
            url: '/pages/search/search',
        })
    },
    goCategory: function (e) {
        let id = e.currentTarget.dataset.cateid;
        wx.setStorageSync('categoryId', id);
        wx.switchTab({
            url: '/pages/category/index?utm_campaign=ff&utm_content=3&gsadid=34dfs',
        })
    },
    handleTap: function (event) {
        //阻止冒泡 
    },
    // onShareAppMessage: function () {
    //     let info = wx.getStorageSync('userInfo');
    //     return {
    //         title: '海风小店',
    //         desc: '开源微信小程序商城',
    //         path: '/pages/index/index?id=' + info.id
    //     }
    // },
    onReady: function() {
        // _gsTracker.searchRequest({
        //     "key_word": "奔驰",           //关键词
        //     "key_word_classify": "汽车",   //关键词分类标签
        //     "key_word_type":"搜索",       //关键词类型
        //     "result_number": 20         //搜索结果数量
        // }, {
        //     "product_prop1": 1, // 自定义字段，key/value都可自定义
        //     "product_prop2": 2,
        // })
        // tracker.searchRequestClick({
        //     "key_word": "奔驰",                //关键词
        //     "key_word_classify": "汽车",       //关键词分类标签
        //     "key_word_type":"搜索",           //关键词类型
        //     "position_number": 2,            //位置序号
        //     "product_id":"123EWR112",   //商品ID
        //     "product_name":"奔驰S600"    //商品名称
        // },{
        //     "product_prop1": 1, // 自定义字段，key/value都可自定义
        // })
    },
    toDetailsTap: function () {
        wx.navigateTo({
            url: '/pages/goods-details/index',
        });
    },
    getIndexData: function () {
        let that = this;
        util.request(api.IndexUrl).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    floorGoods: res.data.categoryList,
                    banner: res.data.banner,
                    channel: res.data.channel,
                    notice: res.data.notice,
                    loading: 1,
                });
                let cartGoodsCount = '';
                if (res.data.cartCount == 0) {
                    wx.removeTabBarBadge({
                        index: 2,
                    })
                } else {
                    cartGoodsCount = res.data.cartCount + '';
                    wx.setTabBarBadge({
                        index: 2,
                        text: cartGoodsCount
                    })
                }
            }
        });
    },
    onReady: function (options) {
        this.getChannelShowInfo();
    },
//     onShareTimeline: function () {

//         return {
    
//           title: '分享的标题',
    
//           query: {
//             key: 'value'
//             // key: 'value' //要携带的参数
    
//           },//分享图,默认小程序的logo
    
//         }
    
//    },
    
    
    test: function () {
        // _gsTracker.track(433, { key1: "value1", key2: "value2"})
        // _gsTracker.trackOrder({
        //     order_id: '4', // 订单ID，必填
        //     product_count: '1', // 商品总数量
        //     order_amount: 123.4, // 订单金额，必填
        //     pay_amount: '123.4', // 实际支付金额
        //     pay_method: "wechat", // 支付方式
        //   });
        var a = [{"key":"1215","value":"广告预约打开小程序"},{"key":"1216","value":"视频号订单中心打开小程序"}]
        a.forEach(item => {
            _gsTracker.setItem(item.key, "item_scene", {
                ['scene_value']: item.value
            });
        })
    },
    onShow: function () {

        // _gsTracker.setPageTitle('首页');
        this.getIndexData();
        var that = this;
        let userInfo = wx.getStorageSync('userInfo');
        if (userInfo != '') {
            that.setData({
                userInfo: userInfo,
            });
        };
        let info = wx.getSystemInfoSync();
        let sysHeight = info.windowHeight - 100;
        this.setData({
            sysHeight: sysHeight,
            autoplay:true
        });
        wx.removeStorageSync('categoryId');
    },
    getChannelShowInfo: function (e) {
        let that = this;
        util.request(api.ShowSettings).then(function (res) {
            if (res.errno === 0) {
                let show_channel = res.data.channel;
                let show_banner = res.data.banner;
                let show_notice = res.data.notice;
                let index_banner_img = res.data.index_banner_img;
                that.setData({
                    show_channel: show_channel,
                    show_banner: show_banner,
                    show_notice: show_notice,
                    index_banner_img: index_banner_img
                });
            }
        });
    },
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading()
        this.getIndexData();
        this.getChannelShowInfo();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },
}
Page(options)