export default {
  isWeixin: function () { // 判断是否在微信内
    // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if (window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) && window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i).toString() === 'micromessenger') {
      return true
    } else {
      return false
    }
  },
  isWeixinMiniProgram: function () {
    if (window.navigator.userAgent.toLowerCase().match(/miniProgram/i) && window.navigator.userAgent.toLowerCase().match(/miniProgram/i).toString() === 'miniProgram') {
      return true
    } else {
      return false
    }
  },
  isAndroid: function () {
    const ua = navigator.userAgent.toLowerCase()
    if (/android/.test(ua)) {
      return true
    } else {
      return false
    }
  },
  isIos: function () {
    const ua = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(ua)) {
      return true
    } else {
      return false
    }
  }
}
