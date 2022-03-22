/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var config = {
    isDebug: false,
    isABTestEnabled: false,
    homeUrl: "smallapp://www.host.com/",
    profileId: 0,
    appName: "",
    platformType: "mp",
    serviceUrls: ["https://wd5-recv.gridsumdissector.com/receiver/"],
    backup_url: "https://wd5-back-recv.gridsumdissector.com/receiver/",
    notUseOpenid: false,
    autoTrack: {
        appLaunch: true,
        appShow: true,
        appError: true,
        appHide: true,
        pageShow: true,
        pageHide: true,
        pageShare: true,
        click: true
    }
};
var _config = {
    version: "1.0.4",
    crossMiniProgram: false
};
var initConfig = function (option) {
    if (!option.profileId) {
        console.warn('profileId是必须的！');
    }
    return Object.assign(config, option, _config);
};

var STORAGE_KEY = 'wd-event-tracker-20200316';

var unid = function () {
    return Math.random().toString(36).slice(2) + "-" + Math.random().toString(36).slice(2) + "-" + Math.random().toString(36).slice(2) + "-" + Math.random().toString(36).slice(2);
};

var storageData = {};
var getItem = function (key) { return wx.getStorageSync(key); };
var setItem = function (key, data) { return wx.setStorageSync(key, data); };
var store = {
    initStore: function (t) {
        storageData = getItem(STORAGE_KEY) || {};
        if (!storageData.client_user_id) {
            this.setData("client_user_id", unid());
        }
    },
    memoizedData: {},
    tempData: {},
    launchData: {},
    abTestData: {},
    restoreData: function () {
        setItem(STORAGE_KEY, storageData);
    },
    setData: function (key, value) {
        storageData[key] = value;
        this.restoreData();
    },
    getData: function (key) {
        return storageData[key];
    },
    removeData: function (key) {
        delete storageData[key];
        this.restoreData();
    }
};

var format = function (date, format) {
    if (format === void 0) { format = 'YYYY-MM-DD HH:mm:ss.f'; }
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate();
    var hour = date.getUTCHours();
    var minute = date.getUTCMinutes();
    var second = date.getUTCSeconds();
    var millise = date.getUTCMilliseconds();
    if (!String.prototype.padStart) {
        String.prototype.padStart = function (maxLength, fillString) {
            if (fillString === void 0) { fillString = ' '; }
            var str = String(this);
            if (str.length >= maxLength) {
                return str;
            }
            fillString = String(fillString);
            if (fillString.length === 0) {
                fillString = ' ';
            }
            var fillLen = maxLength - str.length;
            var timesToRepeat = Math.ceil(fillLen / fillString.length);
            var truncatedStringFiller = fillString
                .repeat(timesToRepeat)
                .slice(0, fillLen);
            return truncatedStringFiller + str;
        };
    }
    function pad(time, pad) {
        if (pad === void 0) { pad = 2; }
        return time.toString().padStart(pad, '0');
    }
    return format
        .replace(/YYYY/g, pad(year))
        .replace(/MM/g, pad(month))
        .replace(/DD/g, pad(day))
        .replace(/HH/g, pad(hour))
        .replace(/mm/g, pad(minute))
        .replace(/ss/g, pad(second))
        .replace(/f/g, pad(millise, 3));
};
var requestCurrentTime = function () {
    return format(new Date());
};

function getCurrentPath() {
    var pages = getCurrentPages();
    return pages[pages.length - 1].route;
}
function getSharePath(path, spid, splv) {
    path = path.indexOf("?") === -1 ? path + "?" : path + "&";
    return path + "gsSpreadId=" + spid + "&gsSpreadLevel=" + splv;
}
var abTestURL = "https://eap-uat.gridsumdissector.com/webserver/jump";
var oldApp = App;
var oldPage = Page;
var oldComponent = Component;
var map = {
    appLaunch: "onLaunch",
    appShow: "onShow",
    appError: "onError",
    appHide: "onHide",
    pageLoad: "onLoad",
    pageShow: "onShow",
    pageHide: "onHide",
    pageShare: "onShareAppMessage",
    componentAttached: "attached"
};
var lifeCycleMethods = {
    data: true,
    onLoad: true,
    onShow: true,
    onReady: true,
    onPullDownRefresh: true,
    onReachBottom: true,
    onShareAppMessage: true,
    onPageScroll: true,
    onResize: true,
    onTabItemTap: true,
    onHide: true,
    onUnload: true,
};
var clickTypes = {
    tap: true,
    longpress: true,
    longtap: true,
};
var autoTrackStrategy = {
    appLaunch: function (that, u, info) {
        var path = info.path, query = info.query, scene = info.scene, referrerInfo = info.referrerInfo;
        if (tracker$2) {
            tracker$2.store.launchData = {
                scene: scene,
                path: path,
                query: query,
                refrenceId: referrerInfo === null || referrerInfo === void 0 ? void 0 : referrerInfo.appId,
            };
            var utmKey = {
                utm_campaign: true,
                utm_medium: true,
                utm_source: true,
                utm_adgroup: true,
                utm_term: true,
                utm_content: true,
                utm_channel: true,
                utm_account: true,
                gsadid: true
            };
            var utmData = tracker$2.store.getData("_gsutm") || {};
            var tempUtmData = {};
            // launch时清空utm参数
            tracker$2.store.setData("_gstemputm", tempUtmData);
            var isUtmExist = false;
            for (var key in query) {
                if (key in utmKey) {
                    isUtmExist = true;
                    utmData["latest_" + key] = query[key];
                    tempUtmData["current_" + key] = query[key];
                }
            }
            isUtmExist && tracker$2.store.setData("_gsutm", utmData);
            isUtmExist && tracker$2.store.setData("_gstemputm", tempUtmData);
            tracker$2.isRefChangeInLaunch = true;
            tracker$2.sender.send({
                event: "s_refchange",
                event_type: "track",
                event_time: requestCurrentTime()
            });
            fetchABTestConfig();
            tracker$2.sender.send({
                event: "s_app_launch",
                event_type: "track",
                event_time: requestCurrentTime()
            });
        }
    },
    appError: function (that, u, error) {
        if (tracker$2) {
            tracker$2.sender.send({
                event: "s_app_error",
                event_type: "track",
                event_time: requestCurrentTime(),
            }, {}, { error: error });
        }
    },
    appShow: function (that, u, info) {
        if (tracker$2) {
            var oldscene = tracker$2.store.launchData.scene;
            var isRefchanged = false;
            var path = info.path, query = info.query, scene = info.scene, referrerInfo = info.referrerInfo;
            tracker$2.store.launchData = {
                scene: scene,
                path: path,
                query: query,
                refrenceId: referrerInfo === null || referrerInfo === void 0 ? void 0 : referrerInfo.appId,
            };
            if (oldscene != tracker$2.store.launchData.scene) {
                // 来源变化清空utm参数
                tracker$2.store.setData("_gstemputm", {});
                isRefchanged = true;
            }
            var utmKey = {
                utm_campaign: true,
                utm_medium: true,
                utm_source: true,
                utm_adgroup: true,
                utm_term: true,
                utm_content: true,
                utm_channel: true,
                utm_account: true,
            };
            var utmData = tracker$2.store.getData("_gsutm") || {};
            var tempUtmData = {};
            var tempStoredData = tracker$2.store.getData("_gstemputm");
            var isUtmExist = false;
            for (var key in query) {
                if (key in utmKey) {
                    isUtmExist = true;
                    utmData["latest_" + key] = query[key];
                    tempUtmData["current_" + key] = query[key];
                }
            }
            if (!tempStoredData && isUtmExist)
                isRefchanged = true;
            if (tempStoredData && isUtmExist) {
                for (var key in tempStoredData) {
                    if (tempStoredData[key] != tempUtmData[key])
                        isRefchanged = true;
                }
                for (var key in tempUtmData) {
                    if (tempUtmData[key] != tempStoredData[key])
                        isRefchanged = true;
                }
            }
            isUtmExist && tracker$2.store.setData("_gsutm", utmData);
            isUtmExist && tracker$2.store.setData("_gstemputm", tempUtmData);
            if (isRefchanged && !tracker$2.isRefChangeInLaunch) {
                tracker$2.sender.send({
                    event: "s_refchange",
                    event_type: "track",
                    event_time: requestCurrentTime()
                });
            }
            // tracker?.register({ appShowTime: Date.now() });
            tracker$2.store.tempData.appShowTime = Date.now();
            tracker$2.sender.send({
                event: "s_app_show",
                event_type: "track",
                event_time: requestCurrentTime(),
            });
        }
    },
    appHide: function (that) {
        if (tracker$2) {
            tracker$2.isRefChangeInLaunch = false;
            var appShowTime = tracker$2.store.tempData.appShowTime;
            var currentTime = Date.now();
            var eventDuration = undefined;
            if (appShowTime) {
                eventDuration = currentTime - appShowTime;
            }
            tracker$2.sender.send({
                event: "s_app_hide",
                event_type: "track",
                event_time: requestCurrentTime(),
            }, void 0, {
                eventDuration: eventDuration,
            });
        }
    },
    pageLoad: function (that, orginMethodOutput, urlParams) {
        if (!tracker$2)
            return;
        var curPath = getCurrentPath();
        urlParams && tracker$2._appendAllUrlParams(curPath, urlParams);
        if (urlParams && urlParams.s_abtest_testid && urlParams.s_abtest_verid) {
            that.setData({
                s_abtest_testid: urlParams.s_abtest_testid,
                s_abtest_verid: urlParams.s_abtest_verid
            });
        }
        if (urlParams && urlParams.gsSpreadId && urlParams.gsSpreadLevel) {
            tracker$2._addUrlParams(curPath, {
                spreadId: urlParams.gsSpreadId,
                spreadLevel: urlParams.gsSpreadLevel,
            });
        }
        else if (!tracker$2.urlParams[curPath]) {
            tracker$2._addUrlParams(curPath, {
                spreadId: unid(),
                spreadLevel: "0",
            });
        }
        // startABTest(curPath);
    },
    pageShow: function (that) {
        if (tracker$2) {
            var data = {
                event: "s_page_show",
                event_type: "track",
                event_time: requestCurrentTime()
            };
            var abtest_testid = that.data.s_abtest_testid;
            var abtest_verid = that.data.s_abtest_verid;
            if (abtest_testid && abtest_verid) {
                tracker$2.sender.send(data, {}, {
                    abtest_testid: abtest_testid,
                    abtest_verid: abtest_verid
                });
            }
            else {
                tracker$2.sender.send(data);
            }
        }
    },
    pageHide: function (that) {
        if (tracker$2) {
            tracker$2.sender.send({
                event: "s_page_hide",
                event_type: "track",
                event_time: requestCurrentTime(),
            });
        }
    },
    pageShare: function (that, shareData) {
        if (!tracker$2)
            return shareData;
        var path = shareData && shareData.path ? shareData.path : getCurrentPath();
        var pathWithoutParam = path.split("?")[0];
        var title = shareData && shareData.title ? shareData.title : "未知标题";
        var paramCache = tracker$2.urlParams[pathWithoutParam];
        if (!paramCache) {
            paramCache = {
                spreadId: unid(),
                spreadLevel: "0",
            };
            tracker$2._addUrlParams(pathWithoutParam, paramCache);
        }
        var spreadId = paramCache.spreadId;
        var spreadLevel = Number(paramCache.spreadLevel) + 1;
        tracker$2.sender.send({
            event: "s_page_share",
            event_type: "track",
            event_time: requestCurrentTime(),
        }, {}, {
            shareTitle: title,
            sharePath: pathWithoutParam,
            spreadId: spreadId,
            spreadLevel: spreadLevel,
        });
        return __assign(__assign({}, shareData), { path: getSharePath(path, spreadId, spreadLevel) });
    },
    componentAttached: function (that, u) {
        var _a;
        var componentUrl = ((_a = that.is) === null || _a === void 0 ? void 0 : _a.charAt(0)) == "/" ? that.is : "/" + that.is;
        if (tracker$2 && componentUrl) {
            var url = tracker$2.getABTest(that.data.gsTestBaseURL);
            var isABTest = that.data.isGSTestDefault;
            if (url && url.indexOf("s_abtest_testid") >= 0) {
                isABTest = url.startsWith(componentUrl) ? true : false;
            }
            if (isABTest !== undefined) {
                that.setData({
                    isGSTestDefault: isABTest
                });
            }
        }
    }
};
function proxy(option, autoTrackName) {
    var method = map[autoTrackName];
    var oldMethod = option[method];
    var autoTrack = autoTrackStrategy[autoTrackName];
    option[method] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var that = this;
        var returnValue = oldMethod === null || oldMethod === void 0 ? void 0 : oldMethod.call.apply(oldMethod, __spreadArrays([this], args));
        var newReturnValue = autoTrack.apply(void 0, __spreadArrays([that, returnValue], args));
        return newReturnValue || returnValue;
    };
}
function proxyClick(option) {
    if (tracker$2 === null || tracker$2 === void 0 ? void 0 : tracker$2.config.autoTrack.click) {
        var _loop_1 = function (key) {
            var oldMethod = option[key];
            if (typeof oldMethod === "function" && !(key in lifeCycleMethods)) {
                option[key] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    if (key === "gsTap")
                        return oldMethod.call.apply(oldMethod, __spreadArrays([this], args));
                    var e = args[0];
                    if (e && typeof e === "object" && e.type in clickTypes) {
                        var target = e.currentTarget || {};
                        var dataset = target.dataset || {};
                        var data = {
                            type: e.type,
                            function_name: key,
                            element_id: target.id,
                            element_type: dataset['type'],
                            element_content: dataset["content"],
                            element_name: dataset["name"],
                            element_title: dataset["title"],
                            element_index: dataset["index"]
                        };
                        tracker$2 === null || tracker$2 === void 0 ? void 0 : tracker$2.sender.send({
                            event: "s_behavior_click",
                            event_type: "track",
                        }, {}, data);
                    }
                    return oldMethod.call.apply(oldMethod, __spreadArrays([this], args));
                };
            }
        };
        for (var key in option) {
            _loop_1(key);
        }
    }
}
function refactorApp(tracks) {
    App = function (option) {
        tracks.forEach(function (t) { return proxy(option, t); });
        oldApp.call(this, option);
    };
}
function refactorPage(tracks) {
    Page = function (option) {
        proxyClick(option);
        option["gsTap"] = function (element) {
            try {
                tracker$2.trackMouseClick(element);
            }
            catch (e) { }
        };
        option["gsScroll"] = function (event) {
            try {
                tracker$2.trackScrollEvent(this, event);
            }
            catch (e) { }
        };
        tracks.forEach(function (t) { return proxy(option, t); });
        oldPage.call(this, option);
    };
}
function refactorComponent(tracks) {
    Component = function (option) {
        proxyClick(option);
        option["gsTap"] = function (element) {
            try {
                tracker$2.trackMouseClick(element);
            }
            catch (e) { }
        };
        option["gsScroll"] = function (event) {
            try {
                tracker$2.trackScrollEvent(this, event);
            }
            catch (e) { }
        };
        tracks.forEach(function (t) { return proxy(option, t); });
        return oldComponent.call(this, option);
    };
}
function refactorWXRedirect() {
    var oldNavigateTo = wx.navigateTo;
    if (oldNavigateTo) {
        delete wx.navigateTo;
        wx.navigateTo = function (option) {
            option.url = tracker$2.getABTest(option.url);
            oldNavigateTo(option);
        };
    }
    var oldRedirect = wx.redirectTo || function () { };
    if (oldRedirect) {
        delete wx.redirectTo;
        wx.redirectTo = function (option) {
            option.url = tracker$2.getABTest(option.url);
            oldRedirect(option);
        };
    }
    var oldReLaunch = wx.reLaunch || function () { };
    if (oldReLaunch) {
        delete wx.reLaunch;
        wx.reLaunch = function (option) {
            option.url = tracker$2.getABTest(option.url);
            oldReLaunch(option);
        };
    }
}
function fetchABTestConfig() {
    if (tracker$2.config.isABTestEnabled) {
        wx.request({
            url: abTestURL + "/" + tracker$2.config.profileId + "/" + tracker$2.store.getData("client_user_id"),
            method: "GET",
            dataType: "json",
            success: function (res) {
                if (res.statusCode == 200) {
                    tracker$2.store.abTestData.config = (res.data);
                    tracker$2.store.setData("abtest_config", res.data);
                }
            },
            fail: function () { }
        });
        // tracker!.store.abTestData.config = [
        //     {
        //       originalPage: "/pages/original/page1/page1",
        //       targetPage: "/pages/test/test1/test1",
        //       testId: "test123",
        //       verId: "ver1",
        //       startDate: "2020-10-18 11:00:00",
        //       endDate: "2020-10-20 00:00:00"
        //     },
        //     {
        //       originalPage: "/pages/original/page2/page2",
        //       targetPage: "/pages/test/test2/test2",
        //       testId: "test456",
        //       verId: "ver2",
        //       startDate: "2020-10-18 11:00:00",
        //       endDate: "2020-10-20 00:00:00"
        //     }
        //   ];
        // tracker!.store.setData("abtest_config", tracker!.store.abTestData.config)
        refactorWXRedirect();
    }
}
// function startABTest(url: string) {
//   let configs = <ABTestResult>(tracker!.store.abTestData.config);
//   if (configs) {
//     let testConfigs = configs["tests"];
//     for (let testConfig of testConfigs) {
//       if (url.startsWith(testConfig.originalPage)) {
//         (<Function>wx.redirectTo)({
//           url: testConfig.targetPage
//         });
//       }
//     }
//   }
// }
var tracker$2 = null;
var initProgram = function (t) {
    tracker$2 = t;
    var config = t.config;
    var appApis = [];
    var pageApis = ["pageLoad"];
    var componentApis = ["componentAttached"];
    for (var key in config.autoTrack) {
        var value = config.autoTrack[key];
        if (value) {
            if (key.startsWith("app")) {
                appApis.push(key);
            }
            else if (key.startsWith("page")) {
                pageApis.push(key);
                componentApis.push(key);
            }
            else if (key.startsWith("component")) {
                componentApis.push(key);
            }
        }
    }
    refactorApp(appApis);
    refactorPage(pageApis);
    refactorComponent(componentApis);
};

var defaultSplitReg = /([A-Z]*)(?=[A-Z]|\b)/;
var lowerCase = function (s) { return s.toLowerCase().trim(); };
var DefaultDelimiter = " ";
var nocase = function (str, option) {
    if (option === void 0) { option = {}; }
    var _a = option.splitReg, splitReg = _a === void 0 ? defaultSplitReg : _a, _b = option.delimiter, delimiter = _b === void 0 ? DefaultDelimiter : _b, _c = option.transform, transform = _c === void 0 ? lowerCase : _c, _d = option.filter, filter = _d === void 0 ? Boolean : _d;
    var result = str
        .split(splitReg)
        .map(transform)
        .filter(filter)
        .join(delimiter);
    return result;
};
var snakeCase = function (str) {
    return nocase(str, {
        delimiter: "_"
    });
};

var pick = function (obj, keys) {
    return keys.reduce(function (prev, next) {
        prev[next] = obj[next];
        return prev;
    }, {});
};

var utf8Encode = function (string) {
    string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    var utftext = '', start, end;
    var stringl = 0, n;
    start = end = 0;
    stringl = string.length;
    for (n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;
        if (c1 < 128) {
            end++;
        }
        else if ((c1 > 127) && (c1 < 2048)) {
            enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
        }
        else {
            enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }
    if (end > start) {
        utftext += string.substring(start, string.length);
    }
    return utftext;
};
var base64Encode = function (data) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = '', tmp_arr = [];
    if (!data) {
        return data;
    }
    data = utf8Encode(data);
    do {
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);
        bits = o1 << 16 | o2 << 8 | o3;
        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);
    enc = tmp_arr.join('');
    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
            break;
        case 2:
            enc = enc.slice(0, -1) + '=';
            break;
    }
    return enc;
};

/**
 * 进行Url的相关操作
 */
var UrlResolver = /** @class */ (function () {
    function UrlResolver(str) {
        this.domainAndPath = "";
        this.hash = "";
        this.params = [];
        var that = this, query;
        var index1 = str.indexOf("?");
        var index2 = str.indexOf("#");
        that.params = [];
        if (index1 === -1) {
            if (index2 === -1) { // no "?" or "#"
                that.domainAndPath = str;
                query = "";
                that.hash = "";
            }
            else { // only "#"
                that.domainAndPath = str.substr(0, index2);
                query = "";
                that.hash = str.substr(index2 + 1);
            }
        }
        else {
            if (index2 === -1) { // only "?"
                that.domainAndPath = str.substr(0, index1);
                query = str.substr(index1 + 1);
                that.hash = "";
            }
            else { // both "?" and "#"
                that.domainAndPath = str.substr(0, index1);
                query = str.substr(index1 + 1, index2 - index1 - 1);
                that.hash = str.substr(index2 + 1);
            }
        }
        if (query) {
            that.params = query.split("&");
        }
    }
    /**
     * 附加参数
     * @param {string} key 键
     * @param {string} value 值
     */
    UrlResolver.prototype.appendParameter = function (key, value) {
        if (!this.startWithAny(key)) {
            this.params.push(key + "=" + value);
        }
    };
    /**
     * 附加经过URL编码后的参数
     * @param {string} key 键
     * @param {string} value 未经URL编码的值
     */
    UrlResolver.prototype.appendEncodedParameter = function (key, value) {
        if (!this.startWithAny(key)) {
            var encodedValue = encodeURIComponent(value);
            this.params.push(key + "=" + encodedValue);
        }
    };
    /**
     * 更改或删除指定参数
     * @param {number} index 元素位置
     * @param {string} value 替换后的值
     */
    UrlResolver.prototype.changeParameter = function (index, value) {
        if (value) {
            this.params.splice(index, 1, value);
        }
        else {
            this.params.splice(index, 1);
        }
    };
    /**
     * 字符串化GsUrl对象
     * @returns {string} 字符串后的GsUrl
     */
    UrlResolver.prototype.toString = function () {
        var that = this;
        var query;
        // Commit append
        if (that.params.length != 0) {
            query = that.params.join("&");
        }
        else {
            query = "";
        }
        return that.domainAndPath + (that.params.length === 0 ? "" : ("?" + query)) + (that.hash === "" ? "" : ("#" + that.hash));
    };
    /**
     * @param {string} key 键
     * @return {boolean} 是否存在该key
     */
    UrlResolver.prototype.startWithAny = function (key) {
        for (var m = 0; m < this.params.length; m++) {
            if ((this.params[m].split("="))[0] === key) {
                return true;
            }
        }
        return false;
    };
    /**
     * 标准化URL路径，如http://www.gridsum.com/product转为http://www.gridsum.com/product/
     * @return {string[]} 非标准化的URL和标准化后的URL
     */
    UrlResolver.prototype.refactorUrl = function () {
        var that = this, path = that.domainAndPath.split("/"), lastPath = path[path.length - 1], arr = [];
        if (!lastPath) { // 以/结尾
            arr.push(that.toString());
            that.domainAndPath = that.domainAndPath.slice(0, -1);
            arr.push(that.toString());
        }
        else if (path.length === 3 || lastPath.indexOf(".") === -1) { // 是否是纯域名或非.*结尾
            arr.push(that.toString());
            that.domainAndPath = that.domainAndPath + "/";
            arr.push(that.toString());
        }
        else {
            arr.push(that.toString());
        }
        return arr;
    };
    /**
     * 返回参数数组或对象
     * @param {boolean} isArray 是否是数组
     * @return {string[] | Object} 返回参数数组或对象
     */
    UrlResolver.prototype.getParams = function (isArray) {
        if (isArray) {
            return this.params;
        }
        else {
            var obj = {};
            for (var i = 0; i < this.params.length; i++) {
                var kv = this.params[i].split("=");
                if (kv.length < 2) {
                    continue;
                }
                obj[kv[0]] = kv[1];
            }
            return obj;
        }
    };
    return UrlResolver;
}());
var urlResolver = UrlResolver;

var tracker$1 = null;
var backupSender = null;
var location = null;
var queue = [];
var sender = {
    initSender: function (t) {
        tracker$1 = t;
        backupSender = new BackupSender(tracker$1);
    },
    setLocation: function (loc) {
        location = loc;
    },
    queueSend: function () {
        var openId = tracker$1 === null || tracker$1 === void 0 ? void 0 : tracker$1.store.getData("open_id");
        if (openId) {
            while (queue.length) {
                var _a = queue.pop(), topData = _a[0], customData = _a[1], innerData = _a[2];
                innerData.openId = openId;
                this.send(topData, customData, innerData);
            }
        }
    },
    send: function (primaryData, customData, innerData) {
        if (customData === void 0) { customData = {}; }
        if (innerData === void 0) { innerData = {}; }
        backupSender === null || backupSender === void 0 ? void 0 : backupSender.sendData(primaryData, customData, innerData);
    }
};
function formatKey(key, isCustomProperty) {
    return (isCustomProperty ? "c_" : "s_") + snakeCase(key);
}
var systemInfo = null;
function getSystemInfo() {
    if (!systemInfo) {
        systemInfo = pick(wx.getSystemInfoSync(), [
            "SDKVersion",
            "model",
            "language",
            "brand",
            "pixelRatio",
            "platform",
            "screenHeight",
            "screenWidth",
            "windowHeight",
            "windowWidth",
            "version",
            "system",
        ]);
    }
    return systemInfo;
}
function getNetWorkType() {
    return new Promise(function (resolve, reject) {
        wx.getNetworkType({
            success: function (res) {
                resolve(res.networkType);
            },
            fail: function (res) {
                reject(res.errMsg);
            },
        });
    });
}
var BackupSender = /** @class */ (function () {
    function BackupSender(tracker) {
        this.failedDataKey = "gsfailed";
        this.failedCountKey = "gsfailedcount";
        this.failedBackupCountKey = "gsfailedcount_backup";
        // -1为终止，0为正常，1为备份接收
        this.statusKey = "gsstatus";
        this.maxFailedCount = 10;
        this.pendingTaskCount = 0;
        this.tracker = tracker;
        this.startStatusChecker();
    }
    BackupSender.prototype.sampleSend = function (data, customData, innerData) {
        var _a;
        var that = this;
        that.pendingTaskCount++;
        function send(serviceUrl) {
            if (!data["event_time"]) {
                data["event_time"] = data.event_time || format(new Date());
            }
            var oldObj = {
                data: data,
                customData: customData,
                innerData: innerData
            };
            if (oldObj["s_track_id"] == undefined) {
                oldObj["s_track_id"] = unid();
            }
            // 获取状态和失败次数
            var statusType = that.getStatus()["type"];
            var failedCount = Number(that.tracker.store.getData(that.failedCountKey) || 0);
            var failedBackupCount = Number(that.tracker.store.getData(that.failedBackupCountKey) || 0);
            // var isBackupSender: boolean = false;
            if (statusType == "0") {
                if (failedCount >= that.maxFailedCount) {
                    // 主站异常超过计数，切换到备份
                    serviceUrl = that.tracker.config.backup_url;
                    that.updateStatus("1");
                }
                else {
                    // 主站正常时，清空备份异常计数
                    serviceUrl = that.tracker.config.serviceUrls[0];
                    failedBackupCount != 0 && that.tracker.store.setData(that.failedBackupCountKey, 0);
                }
            }
            else if (statusType == "1") {
                serviceUrl = that.tracker.config.backup_url;
                // 备份接收时清空主站异常计数
                failedCount != 0 && that.tracker.store.setData(that.failedCountKey, 0);
                if (failedBackupCount >= that.maxFailedCount) {
                    // 备份异常时，停止发送
                    that.updateStatus("-1");
                }
            }
            that.appendData(oldObj);
            if (statusType == "-1") {
                // 主备份异常时停止发送数据
                that.pendingTaskCount = 0;
                return;
            }
            var s_properties = {};
            for (var key in innerData) {
                if (innerData[key] === undefined)
                    continue;
                s_properties[formatKey(key, false)] = innerData[key];
            }
            for (var key in customData) {
                if (customData[key] === undefined)
                    continue;
                s_properties[formatKey(key, true)] = customData[key];
            }
            var url = serviceUrl +
                "?data=" +
                encodeURIComponent(base64Encode(JSON.stringify({
                    s_profile_id: that.tracker.config.profileId,
                    s_client_user_id: that.tracker.store.getData("client_user_id"),
                    s_unique_user_id: data.unique_user_id || that.tracker.store.getData("unique_user_id"),
                    s_event_time: data.event_time,
                    s_event_type: data.event_type,
                    s_event_name: data.event,
                    // s_track_id: data.track_id,
                    s_properties: s_properties,
                })));
            wx.request({
                url: url,
                method: "GET",
                success: function (res) {
                    if (that.getStatus()["type"] === "1") {
                        that.updateFailedCount(true, false);
                    }
                    else {
                        that.updateFailedCount(false, false);
                    }
                    that.pendingTaskCount--;
                    that.pendingTaskCount = that.pendingTaskCount < 0 ? 0 : that.pendingTaskCount;
                    if (oldObj["s_track_id"] != undefined) {
                        that.removeData(oldObj["s_track_id"]);
                    }
                    if (that.pendingTaskCount == 0) {
                        var data = that.peekData();
                        if (data) {
                            var event_time = data["obj"]["data"]["event_time"];
                            data["obj"]["innerData"]["delay"] = new Date().getTime() - new Date(event_time).getTime() + new Date().getTimezoneOffset() * 60 * 1000;
                            that.sampleSend(data["obj"]["data"], data["obj"]["customData"], data["obj"]["innerData"]);
                        }
                    }
                },
                fail: function (res) {
                    if (that.getStatus()["type"] === "1") {
                        that.updateFailedCount(true, true);
                    }
                    else {
                        that.updateFailedCount(false, true);
                    }
                    that.pendingTaskCount--;
                    that.pendingTaskCount = that.pendingTaskCount < 0 ? 0 : that.pendingTaskCount;
                }
            });
        }
        (_a = that.tracker) === null || _a === void 0 ? void 0 : _a.config.serviceUrls.forEach(function (serviceUrl) {
            send(serviceUrl);
        });
    };
    BackupSender.prototype.log = function (data, customData, innerData) {
        var that = this;
        if (that.tracker.config.isDebug) {
            console.groupCollapsed("%ctracked data: %c" + data.event, "color: blue", "color: red");
            var tableData = {};
            for (var key in innerData) {
                if (innerData[key] === undefined)
                    continue;
                tableData[formatKey(key, false)] = innerData[key];
            }
            for (var key in customData) {
                if (customData[key] === undefined)
                    continue;
                tableData[formatKey(key, true)] = customData[key];
            }
            console.log({
                s_profile_id: that.tracker.config.profileId,
                s_client_user_id: that.tracker.store.getData("client_user_id"),
                s_unique_user_id: data.unique_user_id || that.tracker.store.getData("unique_user_id"),
                s_event_time: data.event_time,
                s_event_type: data.event_type,
                s_event_name: data.event,
                // s_track_id: data.track_id,
                s_properties: tableData
            });
            console.groupEnd();
        }
    };
    BackupSender.prototype.sendData = function (primaryData, customData, innerData) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g;
        if (customData === void 0) { customData = {}; }
        if (innerData === void 0) { innerData = {}; }
        var that = this;
        var openId = that.tracker.store.getData("open_id");
        var unionID = that.tracker.store.getData("unionID");
        // primaryData.track_id = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2); // 唯一id
        innerData.trackerVersion = (_a = that.tracker) === null || _a === void 0 ? void 0 : _a.config.version;
        innerData.appName = (_b = that.tracker) === null || _b === void 0 ? void 0 : _b.config.appName;
        innerData.platformType = (_c = that.tracker) === null || _c === void 0 ? void 0 : _c.config.platformType;
        if (primaryData.event_type.startsWith("user") || primaryData.event_type.startsWith("item")) {
            this.log(primaryData, customData, innerData);
            this.sampleSend(primaryData, customData, innerData);
        }
        else {
            innerData.url = (_d = getCurrentPages().pop()) === null || _d === void 0 ? void 0 : _d.route; // 事件发生的具体页面，不一定有
            try {
                if (innerData.url) {
                    var paramCache = (_e = that.tracker) === null || _e === void 0 ? void 0 : _e.allUrlParams[innerData.url];
                    var curUrl = new urlResolver(innerData.url);
                    for (var i in paramCache) {
                        curUrl.appendParameter(i, paramCache[i]);
                    }
                    innerData.url = curUrl.toString();
                }
            }
            catch (e) { }
            var memoizedData_1 = (_f = that.tracker) === null || _f === void 0 ? void 0 : _f.store.memoizedData;
            var temp = ((_g = that.tracker) === null || _g === void 0 ? void 0 : _g.store.launchData) || {};
            var launchData_1 = {};
            for (var i in temp) {
                if (temp.hasOwnProperty(i)) {
                    if (i == "query") {
                        launchData_1[i] = "";
                        for (var j in temp["query"] || {}) {
                            launchData_1[i] += j + "=" + temp["query"][j] + "&";
                        }
                        if (launchData_1[i].length > 0) {
                            launchData_1[i] = launchData_1[i].slice(0, -1);
                        }
                    }
                    else {
                        launchData_1[i] = temp[i];
                    }
                }
            }
            var utmData_1 = (tracker$1 === null || tracker$1 === void 0 ? void 0 : tracker$1.store.getData("_gsutm")) || {};
            var tempUtmData_1 = (tracker$1 === null || tracker$1 === void 0 ? void 0 : tracker$1.store.getData("_gstemputm")) || {};
            var client_session_id_1 = (tracker$1 === null || tracker$1 === void 0 ? void 0 : tracker$1.store.getData("client_session_id")) || '';
            if (!(tracker$1 === null || tracker$1 === void 0 ? void 0 : tracker$1.config.notUseOpenid) && !openId) {
                queue.push([primaryData, customData, innerData]);
                return;
            }
            getNetWorkType().then(function (networkType) {
                Object.assign(innerData, location, getSystemInfo(), launchData_1, utmData_1, tempUtmData_1, {
                    networkType: networkType,
                });
                Object.assign(customData, memoizedData_1);
                innerData.openId = openId;
                innerData.unionID = unionID;
                innerData.client_session_id = client_session_id_1;
                _this.log(primaryData, customData, innerData);
                _this.sampleSend(primaryData, customData, innerData);
            }, function (err) {
                customData.error = err;
                Object.assign(innerData, location, getSystemInfo(), launchData_1, utmData_1, tempUtmData_1);
                Object.assign(customData, memoizedData_1);
                _this.log(primaryData, customData, innerData);
                _this.sampleSend(primaryData, customData, innerData);
            });
        }
    };
    /**
     * 将一条数据追加至localStorage的"gsfailed"中，如果这使得"gsfailed"中的数据条数大于100条，则不追加
     * @param {Object} obj 源对象
     * @param {boolean} noEncode 是否禁止对每个字段进行强制编码
     * @returns {void}
     */
    BackupSender.prototype.appendData = function (obj) {
        var _a;
        try { // localStorage可能为undefined
            var that = this;
            var dataArray = that.popAllData();
            if (dataArray.length < 100) {
                var json = { "obj": obj };
                dataArray.push(json);
                (_a = that.tracker) === null || _a === void 0 ? void 0 : _a.store.setData(this.failedDataKey, JSON.stringify(dataArray));
            }
        }
        catch (e) { }
    };
    /**
     * 移除并返回localStorage的"gsfailed"中的第一条数据
     * @returns {Object} "gsfailed"中的第一条数据，如果不存在，返回undefined
     */
    BackupSender.prototype.peekData = function () {
        var _a;
        try { // localStorage可能为undefined
            var that = this;
            var dataArray = that.popAllData();
            var data = dataArray.splice(0, 1)[0];
            (_a = that.tracker) === null || _a === void 0 ? void 0 : _a.store.setData(this.failedDataKey, JSON.stringify(dataArray));
            return data;
        }
        catch (e) { }
        return null;
    };
    /**
     * 移除localStorage中的track_id为rid的所有数据
     * @param {string} rid 要清除的数据
     * @param {string} url 要清除的URL
     * @returns {void}
     */
    BackupSender.prototype.removeData = function (rid) {
        var _a;
        try { // localStorage可能为undefined
            var that = this;
            var dataArray = that.popAllData(), i;
            for (i = 0; i < dataArray.length; i++) {
                if (dataArray[i]["obj"]["s_track_id"] == rid) {
                    dataArray.splice(i, 1);
                    i--;
                }
            }
            (_a = that.tracker) === null || _a === void 0 ? void 0 : _a.store.setData(this.failedDataKey, JSON.stringify(dataArray));
        }
        catch (e) { }
    };
    /**
     * 清空并返回localStorage的"gsfailed"中的所有数据
     * @returns {Object[]} "gsfailed"中的所有数据
     */
    BackupSender.prototype.popAllData = function () {
        var _a, _b;
        try { // localStorage可能为undefined
            var that = this;
            var internalName = this.failedDataKey;
            var value = (_a = that.tracker) === null || _a === void 0 ? void 0 : _a.store.getData(internalName);
            (_b = that.tracker) === null || _b === void 0 ? void 0 : _b.store.removeData(internalName);
            if (value) {
                return JSON.parse(value);
            }
        }
        catch (e) { }
        return [];
    };
    BackupSender.prototype.updateStatus = function (type) {
        var _a;
        try { // localStorage可能为undefined
            var that = this;
            var key = this.statusKey;
            var value = {
                type: type,
                time: new Date().getTime()
            };
            (_a = that.tracker) === null || _a === void 0 ? void 0 : _a.store.setData(key, JSON.stringify(value));
        }
        catch (e) { }
    };
    BackupSender.prototype.getStatus = function () {
        var _a;
        try { // localStorage可能为undefined
            var that = this;
            var key = this.statusKey;
            var value = (_a = that.tracker) === null || _a === void 0 ? void 0 : _a.store.getData(key);
            if (value) {
                return JSON.parse(value);
            }
        }
        catch (e) { }
        return { type: 0 };
    };
    BackupSender.prototype.startStatusChecker = function () {
        var that = this;
        if (!that.tracker.isStatusCheckerStarted) {
            var checker = function () {
                var status = that.getStatus();
                if (!status["time"])
                    return;
                var time = new Date().getTime() - Number(status["time"]);
                if (status["type"] == "-1") {
                    // 主备站都异常，每隔一分钟主站尝试重发
                    if (time >= 60 * 1000) {
                        that.updateStatus("0");
                    }
                }
                else if (status["type"] == "1") {
                    // 主站异常，处于备份接收状态，每隔10分钟尝试重发
                    if (time >= 60 * 10 * 1000) {
                        that.updateStatus("0");
                    }
                }
            };
            setInterval(checker, 1000);
            this.tracker.isStatusCheckerStarted = true;
        }
    };
    BackupSender.prototype.updateFailedCount = function (isBackup, isIncrease) {
        var _a, _b, _c;
        try {
            var that = this;
            var key = that.failedCountKey;
            if (isBackup)
                key = that.failedBackupCountKey;
            var value = Number(((_a = that.tracker) === null || _a === void 0 ? void 0 : _a.store.getData(key)) || 0);
            if (isIncrease) {
                (_b = that.tracker) === null || _b === void 0 ? void 0 : _b.store.setData(key, value + 1);
            }
            else {
                (_c = that.tracker) === null || _c === void 0 ? void 0 : _c.store.setData(key, value == 0 ? 0 : value - 1);
            }
        }
        catch (e) { }
    };
    return BackupSender;
}());

/**
 * 初始化后才能执行
 * @param target
 * @param name
 * @param desc
 */
function execWhenInited(target, name, desc) {
    var oldMethod = desc.value;
    desc.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.isInited) {
            console.warn("tracker is not inited!!! please exec init method at first!");
            return;
        }
        oldMethod.call.apply(oldMethod, __spreadArrays([this], args));
    };
    return desc;
}
var Tracker = /** @class */ (function () {
    function Tracker() {
        this.sender = sender;
        this.store = store;
        this.isInited = false;
        this.isStatusCheckerStarted = false;
        this.urlParams = {};
        this.allUrlParams = {};
        this.isRefChangeInLaunch = false;
    }
    Tracker.prototype.warnOrExec = function (exec) {
        if (!this.isInited) {
            console.warn("tracker is not inited!!! please exec init method at first!");
            return;
        }
        exec();
    };
    Tracker.prototype._addUrlParams = function (path, params) {
        this.urlParams[path] = params;
    };
    Tracker.prototype._appendAllUrlParams = function (path, params) {
        this.allUrlParams[path] = params;
    };
    Tracker.prototype.init = function (option) {
        // Object.assign(this.config, option);
        if (this.isInited)
            return;
        this.config = initConfig(option);
        store.initStore(this);
        store.setData('client_session_id', unid());
        sender.initSender(this);
        initProgram(this);
        if (this.config.profileId) {
            this.isInited = true;
        }
        else {
            console.warn("profileId 是必需的！");
        }
    };
    Tracker.prototype.register = function (data) {
        Object.assign(this.store.memoizedData, data);
    };
    Tracker.prototype.setOpenId = function (openId) {
        this.store.setData("open_id", openId);
        this.sender.queueSend();
    };
    Tracker.prototype.setUnionID = function (unionID) {
        this.store.setData("unionID", unionID);
    };
    Tracker.prototype.login = function (id) {
        var curId = this.store.getData("unique_user_id");
        if (curId != id) {
            this.store.setData("unique_user_id", id);
            this.setUser({
                unique_user_id: id
            });
        }
    };
    Tracker.prototype.logout = function () {
        this.store.removeData("unique_user_id");
        this.store.setData("client_user_id", unid());
    };
    Tracker.prototype.setUser = function (data) {
        var id = data.unique_user_id;
        if (data.unique_user_id)
            delete data.unique_user_id;
        this.sender.send({
            event: "s_user_set",
            event_type: "user",
            event_time: requestCurrentTime(),
            unique_user_id: id
        }, data);
    };
    Tracker.prototype.setOnceUser = function (data) {
        this.sender.send({
            event: "s_user_set_once",
            event_type: "user",
            event_time: requestCurrentTime(),
        }, data);
    };
    Tracker.prototype.increaseUser = function (data) {
        this.sender.send({
            event: "s_user_increment",
            event_type: "user",
            event_time: requestCurrentTime()
        }, data);
    };
    Tracker.prototype.unsetUser = function (keys) {
        if (!keys || !Array.isArray(keys)) {
            console.log("请检查参数，需为数组");
            return;
        }
        var data = {};
        if (keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                data[keys[i]] = "";
            }
        }
        this.sender.send({
            event: "s_user_unset",
            event_type: "user",
            event_time: requestCurrentTime(),
        }, data);
    };
    Tracker.prototype.setItem = function (itemId, itemType, data) {
        this.sender.send({
            event: "s_item_set",
            event_type: "item",
            item_id: itemId,
            item_type: itemType,
            event_time: requestCurrentTime()
        }, data);
    };
    Tracker.prototype.deleteItem = function (itemId, itemType, keys) {
        if (!keys || !Array.isArray(keys)) {
            console.log("请检查参数，需为数组");
            return;
        }
        var data = {};
        if (keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                data[keys[i]] = "";
            }
        }
        this.sender.send({
            event: "s_item_delete",
            event_type: "item",
            item_id: itemId,
            item_type: itemType,
            event_time: requestCurrentTime()
        }, data);
    };
    Tracker.prototype.setLocation = function (location) {
        this.sender.setLocation({
            latitude: location.latitude,
            longitude: location.longitude,
        });
    };
    Tracker.prototype.trackScrollEvent = function (context, event) {
        try {
            var detail = event["detail"];
            context["setData"]({
                "gsScrollData": {
                    "left": detail["scrollLeft"] || 0,
                    "top": detail["scrollTop"] || 0
                }
            });
        }
        catch (e) { }
    };
    Tracker.prototype.trackMouseClick = function (event, regionId) {
        if (regionId === void 0) { regionId = 0; }
        var gsScrollData = event["currentTarget"]["dataset"]["gsscrolldata"], scrollLeft = 0, scrollTop = 0;
        if (gsScrollData) {
            scrollLeft = gsScrollData["left"] || 0;
            scrollTop = gsScrollData["top"] || 0;
        }
        var mcData = {
            "cx": Math.round(event["detail"]["x"]) + scrollLeft,
            "cy": Math.round(event["detail"]["y"]) + scrollTop,
            "region_id": regionId
        };
        this.track("s_mouse_click", {}, mcData);
    };
    Tracker.prototype.track = function (event, data, innerData) {
        if (!event.startsWith("s_")) {
            event = "c_" + event;
        }
        this.sender.send({
            event: event,
            event_type: "track",
            event_time: requestCurrentTime(),
        }, data, innerData);
    };
    Tracker.prototype.trackOrder = function (data, customData) {
        var obj = {};
        if (typeof data.order_id !== "number" && !data.order_id) {
            console.warn("order_id is must.");
            return;
        }
        obj.order_id = data.order_id;
        obj.product_count = data.product_count;
        obj.order_amount = data.order_amount;
        obj.pay_amount = data.pay_amount;
        obj.pay_method = data.pay_method;
        obj.is_coupon_used = data.is_coupon_used;
        obj.coupon_name = data.coupon_name;
        obj.coupon_type = data.coupon_type;
        obj.coupon_amount = data.coupon_amount;
        this.track("s_order", customData || {}, obj);
    };
    Tracker.prototype.trackOrderDetail = function (data, customData) {
        var obj = {};
        if (typeof data.order_id !== "number" && !data.order_id) {
            console.warn("order_id is must.");
            return;
        }
        if (typeof data.product_id !== "number" && !data.product_id) {
            console.warn("product_id is must.");
            return;
        }
        obj.order_id = data.order_id;
        obj.product_id = data.product_id;
        obj.product_name = data.product_name;
        obj.product_amount = data.product_amount;
        obj.product_count = data.product_count;
        obj.product_price = data.product_price;
        obj.product_brand = data.product_brand;
        obj.product_first_cate = data.product_first_cate;
        obj.product_second_cate = data.product_second_cate;
        this.track("s_order_detail", customData || {}, obj);
    };
    Tracker.prototype.getABTest = function (url) {
        if (!url)
            return url;
        if (!this.store.abTestData.config) {
            this.store.abTestData.config = this.store.getData("abtest_config");
        }
        var configs = (this.store.abTestData.config);
        if (configs) {
            var originalResolver = new urlResolver(url);
            var testConfigs = configs;
            for (var _i = 0, testConfigs_1 = testConfigs; _i < testConfigs_1.length; _i++) {
                var testConfig = testConfigs_1[_i];
                var date = new Date();
                if (date >= new Date(testConfig.startDate) && date <= new Date(testConfig.endDate)) {
                    if (url.startsWith(testConfig.originalPage)) {
                        var targetResolver = new urlResolver(testConfig.targetPage);
                        originalResolver.domainAndPath = targetResolver.domainAndPath;
                        var params = targetResolver.getParams(false);
                        for (var key in params) {
                            originalResolver.appendEncodedParameter(key, params[key]);
                        }
                        originalResolver.appendEncodedParameter("s_abtest_testid", testConfig.testId + "");
                        originalResolver.appendEncodedParameter("s_abtest_verid", testConfig.verId);
                        return originalResolver.toString() || testConfig.targetPage;
                    }
                }
            }
        }
        return url;
    };
    __decorate([
        execWhenInited
    ], Tracker.prototype, "setOpenId", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "setUnionID", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "login", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "logout", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "setUser", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "setOnceUser", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "increaseUser", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "unsetUser", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "setItem", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "deleteItem", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "setLocation", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "trackScrollEvent", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "trackMouseClick", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "track", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "trackOrder", null);
    __decorate([
        execWhenInited
    ], Tracker.prototype, "trackOrderDetail", null);
    return Tracker;
}());
var tracker = new Tracker();

export { tracker as default };
