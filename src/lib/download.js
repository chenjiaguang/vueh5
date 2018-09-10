class download {
  static browserInfo () {
    return {
      userAgent: navigator.userAgent.toLowerCase(),
      isAndroid: Boolean(navigator.userAgent.match(/android/ig)),
      isIphone: Boolean(navigator.userAgent.match(/iphone|ipod/ig)),
      isIpad: Boolean(navigator.userAgent.match(/ipad/ig)),
      isWeixin: Boolean(navigator.userAgent.match(/MicroMessenger/ig)),
      isQqInstalled: (navigator.userAgent.toLowerCase().indexOf(' qq') > -1) && (navigator.userAgent.toLowerCase().indexOf('mqqbrowser') < 0),
      isQq: (navigator.userAgent.toLowerCase().indexOf('mqqbrowser') > -1) && (navigator.userAgent.toLowerCase().indexOf(' qq') < 0),
      isWeibo: Boolean(navigator.userAgent.match(/WeiBo/i))
    }
  }
  static click (weixinCallback) {
    let browser = this.browserInfo()
    if (browser.isWeixin || browser.isQqInstalled || browser.isWeibo) {
      weixinCallback && weixinCallback()
    } else if (browser.isIphone) {
      window.location.href = 'fantuanc://'
      // setTimeout(() => {
      // window.location.href = 'https://itunes.apple.com/cn/app/%E8%8C%83%E5%9B%A2/id1278226297?mt=8'
      // }, 500)
    } else if (browser.isAndroid) {
      window.location.href = 'launchapp://myhost/open'
      // setTimeout(() => {
      // window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.wetime.fanc'
      // }, 500)
    }
  }
}
export default download
