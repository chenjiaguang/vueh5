export default {
  namespaced: true,
  state: {
  },
  mutations: {
    set (state, payload = {}) {
      global.wx.ready(function () {
        // 需在用户可能点击分享按钮前就先调用
        global.wx.updateAppMessageShareData(
          {
            title: payload.title, // 分享标题
            desc: payload.desc, // 分享描述
            link: payload.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: payload.imgUrl // 分享图标
          },
          function (res) {
            // 这里是回调函数
          }
        )
        global.wx.onMenuShareAppMessage({
          title: payload.title, // 分享标题
          desc: payload.desc, // 分享描述
          link: payload.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: payload.imgUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户点击了分享后执行的回调函数
          }
        })
      })
    }
  }
}
