module.exports = {
  isWeixin: function () { // 判断是否在微信内
    // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if (window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) && window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i).toString() === 'micromessenger') {
      return true
    } else {
      return false
    }
  }
}
